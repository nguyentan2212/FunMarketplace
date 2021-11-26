const Web3 = require("web3");
const TruffleContract = require("@truffle/contract");

export const initWeb3 = async () => {
  var provider = null;

  if (window.ethereum) {
    provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    provider = new Web3.providers.HttpProvider("http://localhost:7545");
  }
  var web3 = new Web3(provider);
  return {provider, web3};
};

export const initContract = async (provider, json, address = null) => {
  const contract = TruffleContract(json);
  contract.setProvider(provider);

  let instance = null;
  if (address) {
    instance = await contract.at(address);
  } else {
    instance = await contract.deployed();
  }
  return instance;
};


