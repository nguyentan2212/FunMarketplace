const Exchange = artifacts.require("Exchange");
const TokenFactory = artifacts.require("TokenFactory");
const FNFT = artifacts.require("FunNFT");

module.exports = async function (deployer, network) {
  await deployer.deploy(Exchange);
  const exchange = await Exchange.deployed();

  await deployer.deploy(FNFT);
  const fnft = await FNFT.deployed();

  await deployer.deploy(TokenFactory, exchange.address, fnft.address);
  const factory = await TokenFactory.deployed();
  await factory.createToken(
    "Funny NFT",
    "FNFT",
    "",
    "bafybeiagxjydhu57ufnixw4jktfhbflkbhzd32vvvps4yuofryntm5qkpu"
  );
};
