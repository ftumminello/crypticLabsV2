const index = require("./validateUuid/index.js")

async function main() {
    const res = await index.handler({body:{uuid: 'RUJTTXJBLThnVFpsZS1TNWo3VHctSFp2eWcxLVFWUEhGUy1xMFRDVTE='}});
    console.log(res);
}
main();

