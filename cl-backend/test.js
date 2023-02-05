const index = require('./index');

async function main() {
    const res = await index.handler({promo: 'hEedSW'});
    console.log(res);
}
main();

