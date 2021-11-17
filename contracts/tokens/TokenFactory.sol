// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./FunNFT.sol";

contract TokenFactory {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _collectionIdCounter;
    mapping(uint256 => address) private _collections;
    address private exchangeProxy;

    address immutable collectionImplementation;

    event NewCollection(string name, string symbol, string uri, address collectionAddress);

    constructor(address exchange){
        exchangeProxy = exchange;
        collectionImplementation = address(new FunNFT());
    }

    function createToken(string memory _name, string memory _symbol, string memory _baseURI, string memory _thumbnail)
    public {
        bytes32 salt = keccak256(abi.encodePacked(_collectionIdCounter.current(), _name, _symbol, _baseURI));
        address collectionAddress = ClonesUpgradeable.cloneDeterministic(collectionImplementation, salt);
        FunNFT collection = FunNFT(collectionAddress);
        collection.initialize(_name, _symbol, _baseURI, _thumbnail);
        _collections[_collectionIdCounter.current()] = collectionAddress;
        _collectionIdCounter.increment();
        
        collection.setDefaultApproval(exchangeProxy, true);
        collection.transferOwnership(msg.sender);

        emit NewCollection(_name, _symbol, _baseURI, collectionAddress);
    }

    function fetchCollection(uint256 index) external view returns(address result) {
        result = _collections[index];
    }

    function fetchCollectionOf(address account) external view returns (address[] memory collections){
        uint256 totalCollections = _collectionIdCounter.current();
        uint256 collectionCount = 0;

        for (uint256 i = 0; i < totalCollections; i++) {
            FunNFT collection = FunNFT(_collections[i]);
            address owner = collection.owner();
            if (account == owner){
                collectionCount += 1;
            }
        }

        collections = new address[](collectionCount);

        collectionCount = 0;
        for (uint256 i = 0; i < totalCollections; i++) {
            FunNFT collection = FunNFT(_collections[i]);
            address owner = collection.owner();
            if (account == owner){
                collections[collectionCount] = _collections[i];
                collectionCount += 1;
            }
        }
    }
    
    function fetchCreatedTokenOf(address creator) public view returns(address[] memory collections) {
        uint256 totalCollections = _collectionIdCounter.current();
        uint256 collectionCount = 0;

        for (uint256 i = 0; i < totalCollections; i++) {
            FunNFT collection = FunNFT(_collections[i]);
            uint256 temp = collection.createdTokenOf(creator);
            if (temp > 0){
                collectionCount += 1;
            }
        }

        collections = new address[](collectionCount);

        collectionCount = 0;
        for (uint256 i = 0; i < totalCollections; i++) {
            FunNFT collection = FunNFT(_collections[i]);
            uint256 temp = collection.createdTokenOf(creator);
            if (temp > 0){
                collections[collectionCount] = _collections[i];
                collectionCount += 1;
            }
        }
    }
}