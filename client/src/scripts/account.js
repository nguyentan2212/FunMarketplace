import { initContract, getBalance } from "./ethereum";
const Account = require("../contracts/Account.json");

export async function getAccountInfo(address) {
  const accountMng = await initContract(Account);
  const isVerified = await accountMng.isVerified(address);
  const balance = await getBalance(address);

  if (isVerified) {
    const uri = await accountMng.accountURI(address);
    const data = await fetch(uri).then((response) => response.json());
    const username = data.username;
    const avatar = data.avatar;
    const banner = data.banner;
    return { address, username, avatar, banner, balance, isVerified: true };
  }
  return { address, username: "Guest", avatar: "/img/author/author-6.jpg", banner: "/img/gallery/1.jpg", balance, isVerified: false };
}

export async function registerOrUpdate(uri) {
  const accountMng = await initContract(Account);
  await accountMng.registerOrUpdate(uri);
}
