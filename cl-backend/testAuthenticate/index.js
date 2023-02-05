// Imports
const pg = require('pg');

// Constants
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi";

// Functions
function selectString(s) {
    const selectQuery = `
    SELECT uuid from clPromoCodes
    WHERE promo = '${s}'
    `;
    return (selectQuery);
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
const response = ((s) => {
    return ({
        statusCode: 200,
        body: {
            uuid: `${s}`
        },
    });
});

// Endpoint Handler
exports.handler = async function(event) {
    const badResponse = { // unauthorized request response
        statusCode: 401,
        body: 'Unauthorized request'
    }
    const internalErrResponse = { // db error response
        statusCode: 502,
        body: 'Bad Gateway (unexpected upstream response)'
    }
    const defaultResponse = { // default empty response
        statusCode: 200,
        body: {}
    }
    
    const body = JSON.parse(event.body);
    
    // if request body is not formatted properly
    if (!body?.promo) {
        return (badResponse);
    }

    // create new client object for talking to db
    const client = new pg.Client(dbURL);
    
    // connect clientz
    try {
        client.connect();
    } 
    catch {
        return (internalErrResponse);
    }

    // make request to databse
    const dbRes = await checkPromoAvail(client, body);
    
    // return response for handler
    if (!dbRes) {
        return (internalErrResponse);
    }
    if (dbRes.rowCount === 0) {
        client.end();
        return (defaultResponse);
    }
    client.end();
    return(response(dbRes.rows[0].uuid));
};



// client.query(selectString(event.promo), (err, result) => {
//     if (err) {
//         client.end();
//         resolve(internalErrResponse);
//     }
//     console.log(result.rowCount);
//     if (result.rowCount === 0) {
//         client.end();
//         resolve(defaultResponse);
//     }
//     client.end();
//     resolve(response(result.rows[0].uuid));
// });
    
