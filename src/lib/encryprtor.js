import {utils} from '@waves/waves-signature-generator'

function encrypt(object, password) {
    const jsonObj = JSON.stringify(object);
    return utils.crypto.encryptSeed(jsonObj, password)
}

function decrypt(ciphertext, password) {
    try {
        const decryptedJson = utils.crypto.decryptSeed(ciphertext, password);
        return JSON.parse(decryptedJson)
    } catch (e) {
        throw new Error('Invalid password')
    }
}

module.exports = {
    encrypt,
    decrypt
};