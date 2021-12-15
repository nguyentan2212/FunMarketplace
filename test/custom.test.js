const FunNFT = artifacts.require("FunNFT");
const CollectionFactory = artifacts.require("TokenFactory");
const Exchange = artifacts.require("Exchange");
const AccountManager = artifacts.require("Account");
contract("test factory", async (accounts) => {
  var factory = null;
  var exchange = null;
  var accountManager = null;
  const ZeroAddess = "0x0000000000000000000000000000000000000000";
  const account = {
    public: "0x66Fee2F75fAeC3f5ecB0cd24E40d2b0389E650b5",
    private: "0e9979c64694e74d9fc8d3cd5b814518a1d4518d841245b1cea239bc9a167f80"
  };

  before("init", async () => {
    factory = await CollectionFactory.deployed();
    exchange = await Exchange.deployed();
    accountManager = await AccountManager.deployed();
  });

  it("get init collection", async () => {
    const initCollection = await factory.fetchCollection(0);
    assert.notEqual(initCollection, ZeroAddess, "not zero address");
  });

  // it("new nft", async () => {
  //   const tokenAddress = await factory.fetchCollection(0);
  //   const token = await FunNFT.at(tokenAddress);
  //   const tokenURI = "uri";
  //   const hash = web3.utils.soliditySha3(tokenAddress, account.public, tokenURI);
  //   const { signature } = await web3.eth.accounts.sign(hash, account.private);

  //   const totalSupply = await token.totalSupply();

  //   const mintData = [totalSupply, tokenURI, account.public, 1, signature];

  //   await token.transferOrMint(mintData, account.public, account.public);
  //   const balance = await token.balanceOf(account.public);
  //   assert.equal(balance, 1, "balance is true");
  // });

  it("new order", async () => {
    const tokenAddress = await factory.fetchCollection(0);
    const token = await FunNFT.at(tokenAddress);
    const tokenURI = "uri";
    const hash = web3.utils.soliditySha3(tokenAddress, account.public, tokenURI);
    const { signature } = await web3.eth.accounts.sign(hash, account.private);

    const mintData = [0, tokenURI, account.public, 1, signature];
    await token.transferOrMint(mintData, account.public, account.public);
    const order = [0, account.public, tokenAddress, 0, ZeroAddess, 1, false];
    await exchange.sell(order);
    const orders = await exchange.fetchOrderOf(account.public);
    assert.equal(orders.length, 1, "1 order");
  });

  it("buy", async () => {
    const tokenAddress = await factory.fetchCollection(0);
    const token = await FunNFT.at(tokenAddress);

    try {
      await exchange.buy(0, { from: "0x66BdAC0E007F8c6713229655BD265378c26f4fDC", value: 1 });
    } catch (e) {
      console.log(e);
    }
    const owner = await token.ownerOf(0);
    assert.equal(owner, "0x66BdAC0E007F8c6713229655BD265378c26f4fDC", "must be owner");
  });

  it("test account manager", async () => {
    await accountManager.registerOrUpdate("hello");
    const isVerified = await accountManager.isVerified(account.public);

    assert.equal(isVerified, true, "account must be verified");
  });
});
