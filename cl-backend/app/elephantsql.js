// imports (requires)
const pg = require('pg');
const format = require('pg-format');
const functions = require('../modules/functions');

// strings & queries
const dbURL = "postgres://gvlwnfqi:nI-R82j_TJ7_Y0cdtHEoLW74icqAOYbT@kashin.db.elephantsql.com/gvlwnfqi"
const createTableSqlString = `
CREATE TABLE clPromoCodes (
    rowId serial PRIMARY KEY,
    promo VARCHAR ( 6 ) UNIQUE NOT NULL,
    uuid VARCHAR ( 150 ) UNIQUE NOT NULL,
    isUsed BOOLEAN NOT NULL,
    manuallyShared BOOLEAN NOT NULL,
    applicationStatus BOOLEAN,
    shareRow1 INTEGER UNIQUE,
    shareRow2 INTEGER UNIQUE,
    shareRow3 INTEGER UNIQUE,
    twitterHandle VARCHAR ( 50 ),
    discordHandle VARCHAR ( 50 ),
    lastModified TIMESTAMP  without time zone NOT NULL
)`;
const insertPromoCodeString = `
INSERT INTO clPromoCodes (promo, uuid, isUsed, manuallyShared, lastModified) VALUES %L
RETURNING rowid`;

const testUpdateString = `
UPDATE clPromoCodes (isused, applicationstatus) 
SET (true, true)
WHERE rowid=6
`
const testSelectString = `
SELECT rowid, sharerow1 FROM clPromoCodes
WHERE uuid='4Fw2xa-J07pnt-QFbdVY-KGHH4h-YougGN-RP4Top'`

const authenticateDataString = `
SELECT rowID from clPromoCodes
WHERE rowID<5`

const values = functions.generatePromocodeArr(3, 6);
const client = new pg.Client(dbURL);
client.connect((err) => {
    if (err) {
        return console.err("Refused to connect");
    }
    // CREATE TABLE
    // client.query(createTableSqlString, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     console.log(result);
    //     client.end();
    // })

    // INSERT VALUES TO TABLE
    // client.query(format(insertPromoCodeString, values), (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     console.log(result);
    //     client.end();
    // })
    
    // RUN TEST QUERY
    client.query(testUpdateString, (err, result) => {
        if (err) {
            console.error(err);
        }
        client.end();
        console.log(result);
    })

    // UPDATE VALUES TO TABLE
    // const u = [true, true];
    // console.log(format(testUpdateString, u));
    // client.query(format(testUpdateString, u), (err, res) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     client.end();
    //     console.log(res);
    // })
})