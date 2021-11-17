import { getAccount, getInstanceOf, signMintData, toBigNum } from "./utils";
const TokenFactory = require("../contracts/TokenFactory.json");
const FunNFT = require("../contracts/FunNFT.json");

const defaultCover = "./img/gallery/1.jpg";
const provider = window.ethereum;

export const getCollection = async (index) => {
  const factoryInstance = await getInstanceOf(provider, TokenFactory);
  const tokenAddress = await factoryInstance.fetchCollection(index);
  const tokenInstance = await getInstanceOf(provider, FunNFT, tokenAddress);

  const tokenName = await tokenInstance.name();
  const tokenAvatar = await tokenInstance.getThumbnail();
  const total = await tokenInstance.totalSupply();
  var tokenCover = null;
  if (total > 1) {
    tokenCover = await tokenInstance.tokenURI(0);
  } else {
    tokenCover = defaultCover;
  }
  return { tokenName, tokenAddress, tokenAvatar, tokenCover };
};

export const mintAndTransfer = async (id, data) => {
  const factoryInstance = await getInstanceOf(provider, TokenFactory);
  const tokenAddress = await factoryInstance.fetchCollection(id);
  const tokenInstance = await getInstanceOf(provider, FunNFT, tokenAddress);

  const signature = await signMintData(data, getAccount(0));
  await tokenInstance.mintAndTransfer([1, data.uri, data.creator, signature], getAccount(0), {
    from: getAccount(0)
  });
  console.log("done");
};

export const createToken = async (data) => {
  const factoryInstance = await getInstanceOf(provider, TokenFactory);
  await factoryInstance.createToken(data.name, data.symbol, data.baseURL, data.thumbnail, {from: getAccount(0)});
}
