const express = require("express");
const app = express();
const cors = require("cors");
const secp256k1 = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const JSONbig = require('json-bigint')({ useNativeBigInt: true });

const port = 3042;
app.use(cors());
app.use(express.json());

const balances = {
  "0x037fa21747dae5dfc9c141079ea538031476b76923d48a5ec628f3de0bb2ebe1e9": 100,
  "0x02ade83bb06e83613b8b71539ce68753dc0bfce0a46b07a15c0ad4758736ab9376": 50,
  "0x03fd9fcb8a247b5c23f4f1c361b296f89c01e8e6b88dbe97993db72de54fb26fba": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});
//
app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  const signatureObjJson = JSON.parse(signature);
  const signatureObj = { r: BigInt(signatureObjJson.r.slice(0, -1)), s: BigInt(signatureObjJson.s.slice(0, -1)), recovery: signatureObjJson.recovery }
  const msg = recipient.toString().concat(amount);
  const msgHash = sha256(utf8ToBytes(msg));
  const publicKey = hexToBytes(sender);

  const isSigned = secp256k1.secp256k1.verify(signatureObj, msgHash, publicKey);
  if (!isSigned) {
    res.status(400).send({ message: "You are not authorized to send funds from this address!" });
  } else {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
