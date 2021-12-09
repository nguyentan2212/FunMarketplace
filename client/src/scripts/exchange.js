import { initContract, ZeroAddess, getCurrentAccount, toWei } from "./ethereum";
const Exchange = require("../contracts/Exchange.json");

export async function sell(tokenAddress, tokenId, price) {
  const exchange = await initContract(Exchange);
  const seller = await getCurrentAccount();
  const weiPrice = await toWei(price);
  //const signature = await signMintData(account, tokenAddress, uri);

  const order = [seller, tokenAddress, tokenId, ZeroAddess, weiPrice, false];

  console.log(order);
  try {
    await exchange.sell(order, { from: seller });
  } catch (e) {
    console.log(e);
  }
}

export async function getAllOrders() {
  const exchange = await initContract(Exchange);
  const orders = exchange.fetchOrders();
  return orders;
}