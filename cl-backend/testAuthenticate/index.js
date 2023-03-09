// Imports
const pg = require('pg');

// Constants
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi";

// Functions

function checkSignatureString(s) {
    const signatureQuery =`
    SELECT signature, uuid, isUsed FROM clPromoCodes
    WHERE signature='${s}'
    `;
    return (signatureQuery);
}
function selectString(s) {
    const selectQuery = `
    SELECT uuid, isused, signature from clPromoCodes
    WHERE promo = '${s}'
    `;
    return (selectQuery);
}
function putString(wallet, promo, signature) {
    const putQuery = `
    UPDATE clPromoCodes
    SET wallet='${wallet}', signature='${signature}'
    WHERE promo='${promo}'
    `;
    return(putQuery)
}
async function checkSignature(client, signature) {
    try {
        return (await client.query(checkSignatureString(signature)));
    }
    catch (err) {
        client.end();
        return false;
    }
}
async function checkPromoAvail(client, body) {
    try {
        return (await client.query(selectString(body.promo)));
    }
    catch (err) {
        client.end();
        return false;
    }
}
async function linkWallet(client, signature, wallet, promo) {
    try {
        return (await client.query(putString(wallet, promo, signature)));
    }
    catch (err) {
        console.log(err)
        client.end();
        return false;
    }

}
const response = ((uuid, isUsed) => {
    return ({
        statusCode: 200,
        body: {
            uuid: uuid,
            isUsed: isUsed

        },
    });
});
function checkBodyShape(body) {
    const keys = Object.keys(body);
    if (keys.length === 3) {
        if (body?.promo && body?.signature && body?.wallet) {
            return true;
        }
        return false;
    }
    if (keys.length === 2) {
        if (body?.mode === 'signature' && body?.signature) {
            return true;
        }
    }
    return false;
}

// Endpoint Handler
exports.handler = async function(event) {
    const badResponse = (s=1000) => { // unauthorized request response
        return(
            {
            statusCode: 401,
            body: {
                message:'Unauthorized request',
                errorCode: s
            },   
            }
        )
    }
    const internalErrResponse = (s=1000) => { // db error response
        return (
            {
            statusCode: 502,
            body: {
                message:'Bad Gateway (unexpected upstream response)',
                errorCode: s
            }
            }
        )
    }
    const defaultResponse = (s=1000) => { // default empty response
        return(
            {
            statusCode: 200,
            body: {
                status: s
            }
            }
        )
    }
    
    const body = JSON.parse(event.body);
    
    // if request body is not formatted properly
    if (!checkBodyShape(body)) {
        return (badResponse(2000));
    }

    // create new client object for talking to db
    const client = new pg.Client(dbURL);
    
    // connect clientz
    try {
        client.connect();
    } 
    catch {
        return (internalErrResponse(2000));
    }
    // check to see if signature has already been used
    const signatureRes = await checkSignature(client, body.signature);

    // if internal postgres (elephant) error
    if (!signatureRes) {
        return (internalErrResponse(5000))
    }

    // if signature exists
    if (signatureRes.rowCount !== 0) {
        client.end()
        if (body?.mode) {
            return (response(signatureRes.rows[0].uuid, signatureRes.rows[0].isused));
        }
        return (badResponse(3000));
    }

    // if no signature exists
    if (body?.mode) {
        client.end();
        return (defaultResponse());
    }

    // make request to databse
    const dbRes = await checkPromoAvail(client, body);
    
    // if internal postgres (elephant) error
    if (!dbRes) {
        return (internalErrResponse(3000));
    }

    // promo does not exist
    if (dbRes.rowCount === 0) {
        client.end();
        return (defaultResponse(2000));
    }
    // const returnedSignature = dbRes.rows[0].signature;

    // promo is associated with wallet already, I think this is redundant logic and it does not need to be used
    // if (returnedSignature !== null && returnedSignature !== body.signature) {
    //     client.end();
    //     return (defaultResponse(3000))
    // }

    const putRes = await linkWallet(client, body.signature, body.wallet, body.promo);
    
    // if internal postgres (elephant) error
    if (!putRes) {
        client.end();
        return (internalErrResponse(4000));
    }
    client.end();
    return(response(dbRes.rows[0].uuid, dbRes.rows[0].isused));
};