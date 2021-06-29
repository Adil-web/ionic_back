function hex2dec(str) {
    return parseInt(str, 16)
}

function base64(str) {
    return Buffer.from(str).toString('base64')
}

module.exports = {hex2dec, base64}