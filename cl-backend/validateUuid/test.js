const index = require("./index")

const testObj = {
    body: JSON.stringify({
        uuid: 'VktJeVhvLXc1UlJPMC1sYXBIdVAtaDc4akNmLUhSenhVZC1SOFJtRlE=',
        wallet: 'SAMPLE WALLET'
    })
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();