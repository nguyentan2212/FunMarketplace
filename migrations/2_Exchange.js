const Exchange = artifacts.require("Exchange");
const TokenFactory = artifacts.require("TokenFactory");
const FNFT = artifacts.require("FunNFT");

module.exports = async function (deployer) {
  await deployer.deploy(Exchange);
  const exchange = await Exchange.deployed();

  await deployer.deploy(FNFT);
  const fnft = await FNFT.deployed();

  await deployer.deploy(TokenFactory, exchange.address, fnft.address);
  const factory = await TokenFactory.deployed();
  await factory.createToken(
    "Funny NFT",
    "FNFT",
    "https://ipfs.infura.io/ipfs/QmPgE4P6BwsiwVwF3tswhPH3WEenq74fjbPCKSFoSUZRsq"
  );
};
