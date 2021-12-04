import { initContract, getCurrentAccount, signMintData } from "./ethereum";
const Factory = require("../contracts/TokenFactory.json");
const FunNFT = require("../contracts/FunNFT.json");

export const getCollection = async (index) => {
  const factory = await initContract(Factory);
  const collection = await factory.fetchCollection(index);
  return collection;
};

export const getCollectionsOf = async (address) => {
  const factory = await initContract(Factory);
  const collections = await factory.fetchCollectionOf(address);
  return collections;
};

export const getCollectionInfo = async (address) => {
  const collection = await initContract(FunNFT, address);
  const name = await collection.name();
  const symbol = await collection.symbol();
  return { name, symbol, address };
};

export const mintAndTransfer = async (collection, royalty, tokenURI) => {
  const creator = await getCurrentAccount();
  const signature = await signMintData(creator, collection, tokenURI);
  const mintData = [0, tokenURI, creator, royalty, signature];
  const token = await initContract(FunNFT, collection);
  try {
    const { logs } = await token.mintAndTransfer(mintData, creator, { from: creator });
    console.log(logs[0]);
    const { tokenId } = logs[0].args;
    return tokenId.toNumber();
  } catch (e) {
    console.log(e);
  }
};

export const createCollection = async (thumbnailURI, name, symbol) => {
  const factory = await initContract(Factory);
  const creator = await getCurrentAccount();
  try {
    await factory.createToken(name, symbol, thumbnailURI, {from: creator});
  } catch (e) {
    console.log(e);
  }
};
