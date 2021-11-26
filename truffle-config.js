const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

module.exports = {
  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.API_KEY);
      },
      network_id: 3,
      gas: 8000000 //make sure this gas allocation isn't over 4M, which is the max
    }
  },

  mocha: {},
  compilers: {
    solc: {
      version: "0.8.6"
    }
  },
  db: {
    enabled: false
  }
};
