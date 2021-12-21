// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract Account {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter internal _idCounter;
    address[] private _accounts;
    mapping(address => string) private _accountURI;

    event Register(address indexed account, string uri);
    event Update(address indexed account, string uri);

    function accountURI(address account) public view returns(string memory) {
        return _accountURI[account];
    }

    function isVerified(address account) public view returns(bool){
        if(bytes(_accountURI[account]).length > 0){
            return true;
        }
        return false;
    }

    function registerOrUpdate(string memory uri) external {
        _accountURI[msg.sender] = uri;
        if (isVerified(msg.sender)){
            emit Update(msg.sender, uri);
        }
        else {
            _idCounter.increment();
            emit Register(msg.sender, uri);
        }
        
    }

    function getAllAccount() external view returns(address[] memory){
        return _accounts;
    }
}