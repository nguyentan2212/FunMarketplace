const Web3 = require("web3");
const TruffleContract = require("@truffle/contract");

export const ZeroAddess = "0x0000000000000000000000000000000000000000";
var web3 = null;
var provider = null;

export const initWeb3 = async () => {
  if (window.ethereum) {
    provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }
  } else {
    provider = new Web3.providers.HttpProvider("http://localhost:7545");
  }
  web3 = new Web3(provider);
};

export const getWeb3 = async () => {
  if (!web3) {
    await initWeb3();
  }
  return web3;
};

export const getProvider = async () => {
  if (!web3) {
    await initWeb3();
  }
  return provider;
};

export const initContract = async (json, address = null) => {
  const contract = TruffleContract(json);
  if (!web3) {
    await initWeb3();
  }
  contract.setProvider(provider);

  let instance = null;
  if (address) {
    instance = await contract.at(address);
  } else {
    instance = await contract.deployed();
  }
  return instance;
};

export const getCurrentAccount = async () => {
  if (!web3) {
    await initWeb3();
  }
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  return account;
};

export const signMintData = async (account, tokenAddress, tokenURI) => {
  if (!web3) {
    await initWeb3();
  }
  const hash = web3.utils.soliditySha3(tokenAddress, account, tokenURI);
  const signature = await web3.eth.personal.sign(hash, account);
  return signature;
};

export const getBalance = async (account) => {
  if(!web3){
    await initWeb3();
  }
  const weiBalance = await web3.eth.getBalance(account);
  const balance = await web3.utils.fromWei(weiBalance);
  return balance;
}

export const toWei = async (number) => {
  if(!web3){
    await initWeb3();
  }
  const wei = await web3.utils.toWei(number);
  return wei;
}
