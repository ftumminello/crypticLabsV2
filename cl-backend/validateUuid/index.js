// Imports
const pg = require('pg');

// Constants
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi";

// Functions
function selectString(s) {
    const selectQuery = `
    SELECT rowid from clPromoCodes
    WHERE uuid = '${s}'
    `;
    return (selectQuery);
}
async function checkValidUuid(client, body) {
    const uuidPlain = Buffer.from(body.uuid, 'base64').toString('utf8');
    try {
        return (await client.query(selectString(uuidPlain)));
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
            row: `${s}`
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
    if (!body?.uuid) {
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
    const dbRes = await checkValidUuid(client, body);
    
    // return response for handler
    if (!dbRes) {
        return (internalErrResponse);
    }
    if (dbRes.rowCount === 0) {
        client.end();
        return (defaultResponse);
    }
    client.end();
    return(response(dbRes.rows[0].rowid));
};

