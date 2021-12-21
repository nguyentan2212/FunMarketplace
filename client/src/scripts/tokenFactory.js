import { getAccountInfo } from "./account";
import { initContract, getCurrentAccount, signMintData, fromWei } from "./ethereum";
import { getNewestOrderOf } from "./exchange";
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

export const getAllCollections = async () => {
  const factory = await initContract(Factory);
  const collectionsAddress = await factory.getAllCollections();
  let result = [];
  for (let i = 0; i < collectionsAddress.length; i++) {
    const address = collectionsAddress[i];
    const collection = await initContract(FunNFT, address);
    const name = await collection.name();
    const symbol = await collection.symbol();
    const thumbnail = await collection.getThumbnail();
    result[i] = { name, symbol, address, thumbnail };
  }

  return result;
};

export const getCollectionInfo = async (address) => {
  try {
    const collection = await initContract(FunNFT, address);
    const name = await collection.name();
    const symbol = await collection.symbol();
    const thumbnail = await collection.getThumbnail();
    const author = await collection.owner();
    const totalSupply = await collection.totalSupply();
    var items = [];
    for (let i = 0; i < totalSupply; i++) {
      const order = await getNewestOrderOf(address, i);
      if (order) {
        items[i] = {
          tokenAddress: address,
          tokenId: i,
          price: order.price,
          seller: order.seller
        };
      } else {
        items[i] = { tokenAddress: address, tokenId: i };
      }
    }
    return { name, symbol, address, thumbnail, author, items };
  } catch (e) {
    console.log(e);
  }
  return null;
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
  for (let j = 0; j < collections.length; j++) {
    const element = collections[j];
    const token = await initContract(FunNFT, element);
    const num = await token.createdTokenOf(address);
    for (let i = 1; i <= num; i++) {
      const id = await token.createdTokenOfCreatorByIndex(address, i);
      //const id = tid.toNumber();
      const order = await getNewestOrderOf(element, id);
      if (order) {
        result[count] = {
          tokenAddress: element,
          tokenId: id,
          price: order.price,
          seller: order.seller
        };
      } else {
        result[count] = { tokenAddress: element, tokenId: id };
      }
      count++;
    }
  }
  console.log(result);
  return result;
};

export const getNft = async (address, id) => {
  const token = await initContract(FunNFT, address);
  const name = await token.name();
  const symbol = await token.symbol();
  const authorAddress = await token.owner();
  const author = await getAccountInfo(authorAddress);
  const uri = await token.tokenURI(id);
  const data = await fetch(uri).then((response) => response.json());
  return {
    address: address.toUpperCase(),
    name: name.toUpperCase(),
    symbol: symbol.toUpperCase(),
    author: author.username.toUpperCase(),
    title: data.title.toUpperCase()
  };
};
