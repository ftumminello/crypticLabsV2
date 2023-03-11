// BODY INPUT
// clUuid:          string (64bit encoded)
// twitterHandle:   string
// discordHandle:   string
// description:     string
// upToDate:        string
// nftCreation:     string
// goals:           string
// inspo:           string
// projInspo:       string

// Imports
const pg = require('pg');
const format = require('pg-format');

// Constants
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi";
const insertPromoCodes = `
INSERT INTO clPromoCodes (promo, uuid, isUsed, manuallyShared, lastModified) VALUES %L
RETURNING rowid`

// functions
function insertShareIds(arr) {
    return (
    `UPDATE clPromoCodes
    SET isused=${arr[0]}, applicationstatus=${arr[1]}, sharerow1=${arr[2]}, sharerow2=${arr[3]}, sharerow3=${arr[4]}, twitterhandle='${arr[5]}', discordhandle='${arr[6]}',
    description='${arr[7]}', uptodate='${arr[8]}', nftcreation='${arr[9]}', goals='${arr[10]}', inspo='${arr[11]}', projinspo='${arr[12]}', lastmodified='${arr[13]}'
    WHERE rowid=${arr[14]}`
    )
}
async function changeDbStatus(arr, client) {
    // TODO:
    // change the isUsed row to true
    // change the applicationStatus to false
    // populate the share rows
    try {
        const res = await client.query(insertShareIds(arr));
    } catch (err) {
        client.end();
        return false;
    }
    return true;
    
}
async function insertSharedPromoRows(client) {
    // TODO:
    // Error handle for the potential of error on query because promo isn't unique
    
    // What do i do?
    // --generate new rows on the bottom of the table
    // --return rowIDs of newly created rows
    const values = generatePromocodeArr(3, 6);

    try {
        const res = await client.query(format(insertPromoCodes, values));

        // get rows from query
        const rows = res.rows;
        let rowIdArr = [];
        
        // loop through array and extract rowid to array
        for (let i=0; i<rows.length; i++) {
            rowIdArr.push(rows[i].rowid);
        }

        return (rowIdArr)
    } catch (err) {
        client.end();
        return false;
    }
    
}
function checkBodyShape(body) {
    const keys = Object.keys(body);
    if (keys.length === 9) {
        if (body?.clUuid && body?.twitterHandle && body?.discordHandle && body?.description && body?.upToDate && body?.nftCreation && body?.goals && body?.inspo && body?.projInspo) {
            return true;
        }
    }
    return false;
}
function selectString(s) {
    const selectQuery = `
    SELECT rowid, isused, wallet from clPromoCodes
    WHERE uuid = '${s}'
    `;
    return (selectQuery);
}
function generatePasscode(promoLength, characters) {
    let promoCode = '';
    const charLength = characters.length
    for (let i = 0; i < promoLength; i++) {
        promoCode += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return promoCode;
}
function generateUUID() {
    let uuid = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cl = characters.length;
    for (let i=0; i<6; i++) {
        const uuidPartial = generatePasscode(6, characters, cl)
        if (i==5) {
            uuid+=uuidPartial;
        }
        else {
            uuid+=uuidPartial;
            uuid+='-';
        }
    }
    return uuid
}
function generatePromocodeArr(numPromoCodes, promoCodeLength) {
    const promoData = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i=0; i < numPromoCodes; i++) {
        const time = new Date();
        promoData.push([generatePasscode(promoCodeLength, characters), generateUUID(), false, true, time.toISOString()]);
    }
    return promoData
}
function generateUpdateArr(shareIds, body, usedRowId) {
    let retArr = [];
    const time = new Date();
    const boolArr = [true, false];
    retArr = boolArr.concat(shareIds);
    retArr.push(body.twitterHandle);
    retArr.push(body.discordHandle);
    retArr.push(body.description);
    retArr.push(body.upToDate);
    retArr.push(body.nftCreation);
    retArr.push(body.goals);
    retArr.push(body.inpso);
    retArr.push(body.projInspo);
    retArr.push(time.toISOString());
    retArr.push(usedRowId);

    return(retArr)
}
async function checkValidUuid(client, uuid) {
    const uuidPlain = Buffer.from(uuid, 'base64').toString('utf8');
    try {
        const res = await client.query(selectString(uuidPlain));
        const isUsed = res?.rows[0]?.isused
        const isWallet = res?.rows[0]?.wallet
        // if null res or empty rows or isUsed
        if (!res || res.rows === [] || isUsed || !isWallet) {
            return {isvalid: false, usedRow: res.rows[0]};
        }
        return {isValid: true, usedRow: res.rows[0].rowid};
    }
    catch (err) {
        client.end();
        return {isValid: false, usedRow: err};
    }
}

// endpoint handler
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
        body: {}
    }

    // define body and check shape
    const body = JSON.parse(event.body);
    if(!checkBodyShape(body)) {
        return badResponse(2000);
    }

    // create new client object for talking to db and connect
    const client = new pg.Client(dbURL);
    try {
        client.connect();
    } 
    catch {
        return (internalErrResponse(2000));
    }

    // validate uuid
    const {isValid, usedRow} = await checkValidUuid(client, body.clUuid);
    if (!isValid) {
        client.end();
        return badResponse(3000);
    }

    // Manipulating the database
    const shareIds = await insertSharedPromoRows(client);
    if (!shareIds) {
        return internalErrResponse(3000);
    }

    // Generate Update arr & Write DbStatuses
    const updateArr = generateUpdateArr(shareIds, body, usedRow);
    const updateStatus = await changeDbStatus(updateArr, client);

    if (!updateStatus) {
        return (internalErrResponse(4000));
    }
    client.end();
    return (defaultResponse);
}