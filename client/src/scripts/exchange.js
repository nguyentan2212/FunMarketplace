import { initContract, ZeroAddess, getCurrentAccount, toWei } from "./ethereum";
import { getNft } from "./tokenFactory";
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

export async function getAllOrders(search) {
  const exchange = await initContract(Exchange);
  const orders = await exchange.fetchOrders();

  if (search) {
    search = search.toUpperCase();
    let result = [];
    let count = 0;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const item = await getNft(order.tokenAddress, order.tokenId);
      console.log(item);
      if (
        item.name.includes(search) ||
        item.symbol.includes(search) ||
        item.title.includes(search) ||
        item.author.includes(search) ||
        item.address.includes(search)
      ) {
        result[count] = order;
        count++;
        console.log(item);
      }
    }
    return result;
  }
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
