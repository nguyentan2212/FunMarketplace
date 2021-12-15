import { initContract, ZeroAddess, getCurrentAccount, toWei, fromWei } from "./ethereum";
const Exchange = require("../contracts/Exchange.json");

export async function sell(tokenAddress, tokenId, price) {
  const exchange = await initContract(Exchange);
  const seller = await getCurrentAccount();
  const weiPrice = await toWei(price);
  //const signature = await signMintData(account, tokenAddress, uri);

  const order = [0, seller, tokenAddress, tokenId, ZeroAddess, weiPrice, false];

  console.log(order);
  try {
    await exchange.sell(order, { from: seller });
  } catch (e) {
    console.log(e);
  }
}

export async function getAllOrders() {
  const exchange = await initContract(Exchange);
  const orders = await exchange.fetchOrders();
  return orders;
}

export async function getOrderOf(address) {
  const exchange = await initContract(Exchange);
  const orders = await exchange.fetchOrderOf(address);
  console.log(orders);

  return orders;
}

export async function getNewestOrderOf(address, id) {
  const exchange = await initContract(Exchange);
  try {
    const order = await exchange.getNewestOrderOf(address, id);
    return order;
  } catch (error) {
    console.warn(error);
  }
  console.log('null');
  return null;
}

export async function cancellOrder(id) {
  const exchange = await initContract(Exchange);
  const account = await getCurrentAccount();
  try {
    await exchange.cancel(id, { from: account });
  } catch (e) {
    console.log(e);
  }
}

export async function buy(id, price) {
  const exchange = await initContract(Exchange);
  const account = await getCurrentAccount();
  try {
    await exchange.buy(id, { from: account, value: price });
  } catch (e) {
    console.log(e);
  }
}