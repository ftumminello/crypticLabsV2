const index = require("./index")

const testObj = {
    body: JSON.stringify({
        uuid: 'RHF1eFc4LURMUk5Cci1qYzZOQTMtRmJWSm1oLTdSdmVNci1hTDNLSDI='
    })
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();