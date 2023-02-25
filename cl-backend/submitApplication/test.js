const index = require("./index")

const testObj = {
    body: JSON.stringify({
        clUuid: 'VktJeVhvLXc1UlJPMC1sYXBIdVAtaDc4akNmLUhSenhVZC1SOFJtRlE=',
        twitterHandle: 'hello',
        discordHandle: 'helo'
    })
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();