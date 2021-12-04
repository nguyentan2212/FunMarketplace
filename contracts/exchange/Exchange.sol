// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "../tokens/FunNFT.sol";

contract Exchange is ReentrancyGuardUpgradeable, ERC721HolderUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using SafeMathUpgradeable for uint256;

    struct Order {
        address seller;
        address tokenAddress;
        uint256 tokenId;
        address buyer;
        uint256 price;
        bool isCancelled;
    }


    CountersUpgradeable.Counter internal _orderIdCounter;
    CountersUpgradeable.Counter internal _orderSoldCounter;
    mapping(uint256 => Order) private orders;

    event New(uint256 id, address seller, address tokenAddress, uint256 tokenId, uint256 price);
    event Canceled(uint256 id, address seller, address tokenAddress, uint256 tokenId, uint256 price);
    event Sold(uint256 id, address seller, address tokenAddress, uint256 tokenId, uint256 price, address buyer);

    constructor() {

    }

    modifier isValid(Order memory order) {
        // seller asset
        FunNFT token = FunNFT(order.tokenAddress);
        address owner = token.ownerOf(order.tokenId);
        require( owner == order.seller || token.isApprovedForAll(owner, order.seller) == true, "Not approved or owner.");

        // buyer asset
        require(order.price > 0, "Cost should be greater than zero.");
        _;
    }

    function transferEth(address to, uint value) internal {
        (bool success,) = to.call{ value: value }("");
        require(success, "transfer failed");
    }

    function sell(Order memory order) external nonReentrant isValid(order) {
        FunNFT token = FunNFT(order.tokenAddress);

        token.safeTransferFrom(order.seller, address(this), order.tokenId);

        uint256 currentId = _orderIdCounter.current();

        Order storage newOrder = orders[currentId];
        newOrder.seller = order.seller;
        newOrder.tokenAddress = order.tokenAddress;
        newOrder.tokenId = order.tokenId;
        newOrder.buyer =  order.buyer;
        newOrder.price = order.price;
        newOrder.isCancelled = order.isCancelled;

        _orderIdCounter.increment();
        emit New(currentId, order.seller, order.tokenAddress, order.tokenId, order.price);
    }

    function buy(uint256 orderId) external nonReentrant {
        require(orderId >= 0 && orderId < _orderIdCounter.current(), "wrong id.");
        
        Order storage order = orders[orderId];
        require(order.buyer == address(0), "item sold");
        require(order.isCancelled == false, "order cancelled");

        address buyer = msg.sender;

        // transfer nft to buyer
        FunNFT token = FunNFT(order.tokenAddress);
        token.safeTransferFrom(address(this), buyer, order.tokenId);

        // pay royalty for creator
        uint256 money = order.price;
        uint256 royalty = token.royaltyOf(order.tokenId);
        address creator = token.creatorOf(order.tokenId);
        if (royalty > 0){
            uint256 temp = money.mul(royalty);
            uint256 royaltyMoney = temp.div(100);
            money = money.sub(royaltyMoney);
            transferEth(creator, royaltyMoney);
        }
        
        // transfer payment token from buyer to seller
        transferEth(order.seller, money);

        order.buyer = buyer;
        _orderSoldCounter.increment();
        emit Sold(orderId, order.seller, order.tokenAddress, order.tokenId, order.price, order.buyer);
    }

    function cancel(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.seller == msg.sender, "Not seller");
        require(order.buyer == address(0), "item sold");

        FunNFT token = FunNFT(order.tokenAddress);
        token.safeTransferFrom(address(this), order.seller, order.tokenId);

        orders[orderId].isCancelled = true;
        emit Canceled(orderId, order.seller, order.tokenAddress, order.tokenId, order.price);
    }

    /* Returns all unsold orders */
    function fetchOrders() public view returns (Order[] memory) {
        uint256 itemCount = _orderIdCounter.current();
        uint256 unsoldItemCount = _orderIdCounter.current() - _orderSoldCounter.current();
        uint256 currentIndex = 0;

        Order[] memory items = new Order[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (orders[i].buyer == address(0)) {
                Order memory currentItem = orders[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

  /* Returns only items that a user has been selling */
    function fetchOrderOf(address seller) external view returns (Order[] memory) {
        uint256 totalItemCount = _orderIdCounter.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (orders[i].seller == seller && orders[i].buyer == address(0)){
                itemCount += 1;
            }
        }

        Order[] memory items = new Order[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (orders[i].seller == seller && orders[i].buyer == address(0)) {
                Order memory currentItem = orders[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items in a collection that had being selling */
    function fetchOrderOfCollection(address collection) external view returns (Order[] memory) {
        uint256 totalItemCount = _orderIdCounter.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (orders[i].tokenAddress == collection && orders[i].buyer == address(0)){
                itemCount += 1;
            }
        }

        Order[] memory items = new Order[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (orders[i].tokenAddress == collection && orders[i].buyer == address(0)) {
                Order memory currentItem = orders[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}