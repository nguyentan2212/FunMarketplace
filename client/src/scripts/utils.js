const Web3 = require("web3");
const Contract = require("@truffle/contract");
const web3 = new Web3(window.ethereum);

export const getAccount = async (id) => {
  const accounts = await web3.eth.getAccounts();
  return accounts[id];
};

export const signMintData = async (data, signer) => {
  const hash = web3.utils.soliditySha3(data.collection, data.creator, data.uri);
  const signature = await web3.eth.personal.sign(hash, signer);
  return signature;
};

export const getInstanceOf = async (provider, json, address = null) => {
  let contract = Contract(json);
  contract.setProvider(provider);
  let instance = null;
  if (address) {
    instance = await contract.at(address);
  } else {
    instance = await contract.deployed();
  }
  return instance;
};

export const toBigNum = (num) => {
    return web3.utils.toBN(num);
}
