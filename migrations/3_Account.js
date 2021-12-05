const Account = artifacts.require("Account");
module.exports = async function (deployer) {
    await deployer.deploy(Account);
}