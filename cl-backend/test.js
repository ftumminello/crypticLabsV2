const index = require("./submitApplication/index.js")

const testObj = {
    body: JSON.stringify({
        clUuid: 'M0pPcnp1LUV3Y0tnMS1qYmt5RkUtNHJDbzlkLXdoZnVJai1NWVFBckk=',
        twitterHandle: 'fakeTwitter',
        discordHandle: 'fakeDiscord'})
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();

