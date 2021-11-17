const FunNFT = artifacts.require("FunNFT");
const CollectionFactory = artifacts.require("TokenFactory");

contract("test factory", async (accounts) => {
  var factory = null;
  before("init", async () => {
    factory = await CollectionFactory.deployed();
  });
  it("create new collection", async () => {
    const data = {
      name: "My Token",
      symbol: "MTN",
      baseURL: "",
      thumbnail: "img/collections/coll-4.jpg"
    };
    
    await factory.createToken(data.name, data.symbol, data.baseURL, data.thumbnail, {
      from: accounts[0]
    });

    const add = await factory.fetchCollection(0);
    console.log(add);
  });
});
