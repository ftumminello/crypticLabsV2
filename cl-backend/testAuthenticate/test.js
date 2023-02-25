const index = require("./index.js")

const testObj = {
    body: JSON.stringify({
        promo: '6dlndj'})
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();

