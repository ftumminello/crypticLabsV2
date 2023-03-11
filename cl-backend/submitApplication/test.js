const index = require("./index")

const testObj = {
    body: JSON.stringify({
        clUuid: 'baduuid',
        twitterHandle: 'gay_twitter',
        discordHandle: 'gay_discord',
        description: 'gay_description',
        upToDate: 'gay_uptodate',
        nftCreation: 'gay_nftCreation',
        goals: 'gay_goals',
        inspo: 'gay_inspo',
        projInspo: 'gay_projInspo'
    })
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();