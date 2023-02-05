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
    uuid VARCHAR ( 150 ) UNIQUE NOT NULL
)`;
const insertPromoCodeString = `
INSERT INTO clPromoCodes (promo, uuid) VALUES %L`;


const testSelectString = `
SELECT * FROM clPromoCodes`

const authenticateDataString = `
SELECT rowID from clPromoCodes
WHERE rowID<5`

// const values = functions.generatePromocodeArr(1000, 6);
const client = new pg.Client(dbURL);
client.connect((err) => {
    if (err) {
        return console.err("Refused to connect");
    }
    // client.query(format(insertPromoCodeString, values), (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     console.log(result);
    //     client.end();
    // })
    client.query(authenticateDataString, (err, result) => {
        if (err) {
            console.error(err);
        }
        client.end();
        console.log(result);
        
    })
})