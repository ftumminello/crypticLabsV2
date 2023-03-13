// BODY INPUT
// uuid: string (64bit encoded)

// Imports
const pg = require('pg');

// Constants
const dbURL = "SECRET_KEY";

// Functions
function selectRowsQuery(s) {
    const selectQuery = `
    SELECT sharerow1, sharerow2, sharerow3 from clPromoCodes
    WHERE uuid = '${s}' AND applicationstatus = true
    `;
    return (selectQuery);
}
function selectPromosQuery(s) {
    const selectQuery = `
    SELECT promo from clPromoCodes
    WHERE rowid = ${s[0]} OR rowid = ${s[1]} OR rowid = ${s[2]}
    `;
    console.log(selectQuery)
    return (selectQuery);
}
async function getRowIds(client, body) {
    const uuidPlain = Buffer.from(body.uuid, 'base64').toString('utf8');
    try {
        return (await client.query(selectRowsQuery(uuidPlain)));
    }
    catch (err) {
        client.end();
        return false;
    }
}
async function getPromoIds(client, rowIds) {
    try {
        return (await client.query(selectPromosQuery(rowIds)));
    }
    catch (err) {
        client.end();
        return false;
    }
}
const response = ((promo1, promo2, promo3) => {
    return ({
        statusCode: 200,
        body: {
            promo1: promo1,
            promo2: promo2,
            promo3: promo3
        },
    });
});

// Endpoint Handler
exports.handler = async function(event) {
    const badResponse = (s=1000) => { // unauthorized request response
        return({
            statusCode: 401,
            body: {
                message: 'Unauthorized request',
                errorCode: s
            }
        })
        
    }
    const internalErrResponse = (s=1000) => { // db error response
        return({
            statusCode: 502,
            body: {
                message:'Bad Gateway (unexpected upstream response)',
                errorCode: s
            }
        })
        
    }
    
    const body = JSON.parse(event.body);
    
    // if request body is not formatted properly
    if (!body?.uuid) {
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
    const rowRes = await getRowIds(client, body);
    
    // return response for handler
    if (!rowRes) {
        return (internalErrResponse(3000));
    }
    if (rowRes.rowCount === 0) {
        client.end();
        return (badResponse(3000));
    }
    if (rowRes.rows[0].sharerow1 === null) {
        client.end();
        return (badResponse(4000));
    }
    const rowsArr = [rowRes.rows[0].sharerow1, rowRes.rows[0].sharerow2, rowRes.rows[0].sharerow3];

    const promoRes = await getPromoIds(client, rowsArr);
    // return response for handler
    if (!promoRes) {
        return (internalErrResponse(4000));
    }
    if (promoRes.rowCount !== 3) {
        client.end();
        return (badResponse(5000));
    }
    if (promoRes.rows[0].promo === null) {
        client.end();
        return (badResponse(6000));
    }

    client.end();
    return(response(promoRes.rows[0].promo, promoRes.rows[1].promo, promoRes.rows[2].promo));
};

