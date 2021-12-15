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
  const thumbnail = await collection.getThumbnail();

  return { name, symbol, address, thumbnail };
};

export const mintAndTransfer = async (collection, royalty, tokenURI) => {
  const creator = await getCurrentAccount();
  console.log(creator, collection, tokenURI);
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
    await factory.createToken(name, symbol, thumbnailURI, { from: creator });
  } catch (e) {
    console.log(e);
  }
};

const getTokenOf = async (collection, address) => {
  const token = await initContract(FunNFT, collection);
  const balance = await token.balanceOf(address);
  var result = [];
  var count = 0;
  for (let i = 0; i < balance; i++) {
    const temp = await token.tokenOfOwnerByIndex(address, i);
    result[count] = { tokenAddress: collection, tokenId: temp };
  }
  return result;
};

export const getAllTokenOf = async (address) => {
  const factory = await initContract(Factory);
  const collections = await factory.fetchCollectionOf(address);
  console.log(collections);
  var result = [];
  for (let i = 0; i < collections.length; i++) {
    const temp = await getTokenOf(collections[i], address);
    result = [...result, ...temp];
  }
  return result;
};

export const getCreatedTokensOf = async (address) => {
  const factory = await initContract(Factory);
  const collections = await factory.fetchCreatedTokenOf(address);
  var result = [];
  var count = 0;
  collections.forEach(async (element) => {
    const token = await initContract(FunNFT, element);
    const num = await token.createdTokenOf(address);
    for (let i = 1; i <= num; i++) {
      const id = await token.createdTokenOfCreatorByIndex(address, i);
      result[count] = { tokenAddress: element, tokenId: id };
      count++;
    }
  });
  return result;
};
