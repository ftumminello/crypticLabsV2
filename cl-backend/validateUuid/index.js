// Imports
const pg = require('pg');

// Constants
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi";

// Functions
function selectString(uuid) {
    const selectQuery = `
    SELECT rowid, isUsed, applicationstatus from clPromoCodes
    WHERE uuid = '${uuid}'
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
const response = ((rowid, isused, applicationStatus) => {
    return ({
        statusCode: 200,
        body: {
            row: `${rowid}`,
            isUsed: isused,
            applicationStatus: applicationStatus
        },
    });
});
function checkBodyShape(body) {
    const keys = Object.keys(body);
    if (keys.length === 1) {
        if (body?.uuid) {
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
    const defaultResponse = { // default empty response
        statusCode: 200,
        body: {
            status: 1000
        }
    }
    
    const body = JSON.parse(event.body);
    
    // if request body is not formatted properly
    if (!checkBodyShape(body)) {
        return badResponse(2000);
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
    const dbRes = await checkValidUuid(client, body);
    
    // return response for handler
    if (!dbRes) {
        return (internalErrResponse(3000));
    }
    // not valid uuid
    if (dbRes.rowCount === 0) {
        client.end();
        return (defaultResponse);
    }
    client.end();
    return(response(dbRes.rows[0].rowid, dbRes.rows[0].isused, dbRes.rows[0].applicationstatus));
};

