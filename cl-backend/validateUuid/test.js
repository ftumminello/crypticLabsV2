const index = require("./index")

const testObj = {
    body: JSON.stringify({
        uuid: 'c0hYdVRHLXhsaW03TC1RVmUwMVMtdklzTTlYLW9WMUdJMi05UG16dFA='
    })
}
async function main() {
    const res = await index.handler(testObj);
    console.log(res);
}
main();