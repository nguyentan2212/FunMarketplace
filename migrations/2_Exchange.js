const Exchange = artifacts.require("Exchange");
const TokenFactory = artifacts.require("TokenFactory");
const FunNFT = artifacts.require("FunNFT");

module.exports = async function (deployer) {
  await deployer.deploy(Exchange);
  const exchange = await Exchange.deployed();
  await deployer.deploy(TokenFactory, exchange.address);
  const factory = await TokenFactory.deployed();
  await factory.createToken("Fun NFT", "FNFT", "", "img/items/static-1.jpg");
};
