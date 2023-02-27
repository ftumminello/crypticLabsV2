// Imports
const pg = require('pg');

// Constants
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi";

// Functions
function selectString(s) {
    const selectQuery = `
    SELECT uuid, isused, wallet from clPromoCodes
    WHERE promo = '${s}'
    `;
    return (selectQuery);
}
function putString(wallet, promo) {
    const putQuery = `
    UPDATE clPromoCodes
    SET wallet='${wallet}'
    WHERE promo='${promo}'
    `;
    return(putQuery)
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
async function linkWallet(client, wallet, promo) {
    console.log(putString(wallet, promo))
    try {
        return (await client.query(putString(wallet, promo)));
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
    if (keys.length === 2) {
        if (body?.promo && body?.wallet) {
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

    // make request to databse
    const dbRes = await checkPromoAvail(client, body);
    
    // return response for handler
    if (!dbRes) {
        return (internalErrResponse(3000));
    }
    // promo does not exist
    if (dbRes.rowCount === 0) {
        client.end();
        return (defaultResponse(2000));
    }
    const returnedWallet = dbRes.rows[0].wallet;

    // promo is associated with wallet already
    console.log(returnedWallet);
    console.log(dbRes.rows[0]);
    if (returnedWallet !== null && returnedWallet !== body.wallet) {
        client.end();
        return (defaultResponse(3000))
    }

    const putRes = await linkWallet(client, body.wallet, body.promo);
    if (!putRes) {
        client.end();
        return (internalErrResponse(4000));
    }
    client.end();
    return(response(dbRes.rows[0].uuid, dbRes.rows[0].isused));
};