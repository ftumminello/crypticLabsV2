const index = require("./index.js")

const testObj = {
    body: JSON.stringify(
        {
            promo: 'fuckyou',
            signature: 'uniqueSignature',
            wallet: 'GetWrecked',
        }
    )
}
const testObj1 = {
    body: JSON.stringify(
        {
            mode: 'signature',
            signature: 'fuckElon'
        }
    )
}

async function main() {
    const res = await index.handler(testObj1);
    console.log(res);
}
main();

