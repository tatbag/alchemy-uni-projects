//our transaction msg to be signed is:
//to+amount
const secp256k1 = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex,utf8ToBytes } = require("ethereum-cryptography/utils");

const secp = secp256k1.secp256k1;

//steps
//1. generate msgHash
//2. sign using provided private key
const privateKey = Buffer.from(process.argv[2], 'hex');
const recipientAddr = (Buffer.from(process.argv[3])).toString();
const amount = (Buffer.from(process.argv[4])).toString();

const msg = "0x" + recipientAddr.concat(amount);
const msgHash = sha256(utf8ToBytes(msg));
const signature = secp.sign(msgHash, privateKey);
console.log("Signature: ", signature);
console.log("Your publicKey: ", toHex(secp.getPublicKey(privateKey)));
