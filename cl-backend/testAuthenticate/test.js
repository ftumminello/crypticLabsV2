const index = require("./index.js")

const testObj = {
    body: JSON.stringify(
        {
            promo: 'jHMXcJ',
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
    const res = await index.handler(testObj);
    console.log(res);
}
main();

