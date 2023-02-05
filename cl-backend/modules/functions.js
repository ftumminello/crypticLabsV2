// functions
function generatePasscode(promoLength, characters) {
    let promoCode = '';
    const charLength = characters.length
    for (let i = 0; i < promoLength; i++) {
        promoCode += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return promoCode;
}

function generateUUID() {
    let uuid = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cl = characters.length;
    for (let i=0; i<6; i++) {
        const uuidPartial = generatePasscode(6, characters, cl)
        if (i==5) {
            uuid+=uuidPartial;
        }
        else {
            uuid+=uuidPartial;
            uuid+='-';
        }
    }
    return uuid
}

function generatePromocodeArr(numPromoCodes, promoCodeLength) {
    // TODO have function to create UUID, needs to be present to submit to cloud db

    const promoData = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i=0; i < numPromoCodes; i++) {
        promoData.push([generatePasscode(promoCodeLength, characters), generateUUID()]);
    }
    return promoData
}

module.exports = {generatePasscode, generateUUID, generatePromocodeArr}