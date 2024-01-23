const secp256k1 = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");

const secp = secp256k1.secp256k1;

const pk1 = secp.utils.randomPrivateKey();
const pk2 = secp.utils.randomPrivateKey();
const pk3 = secp.utils.randomPrivateKey();

const pb1 = secp.getPublicKey(pk1);
const pb2 = secp.getPublicKey(pk2);
const pb3 = secp.getPublicKey(pk3);

console.log("pk1: ", toHex(pk1));
console.log("pb1: ", toHex(pb1));

console.log("pk2: ", toHex(pk2));
console.log("pb2: ", toHex(pb2));

console.log("pk3: ", toHex(pk3));
console.log("pb3: ", toHex(pb3));