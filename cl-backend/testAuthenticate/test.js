const index = require("./index.js")

const testObj = {
    body: JSON.stringify(
        {
            promo: '',
            wallet: 'afdsafsdw'
        }
    )
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();

