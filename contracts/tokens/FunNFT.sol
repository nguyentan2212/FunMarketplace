// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "../libraries/FunLibAsset.sol";
import "./NFTBase.sol";

contract FunNFT is NFTBase {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}
    string private thumbnail;

    function initialize(string memory _name, string memory _symbol, string memory _baseTokenURI, string memory _thumbnail) 
    initializer 
    public {
        __ERC721_init(_name, _symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init();

        baseTokenURI = _baseTokenURI;
        thumbnail = _thumbnail;
    }

    function transferOrMint(FunLibAsset.Mint721Data memory data, address from, address to) external {
        if (_exists(data.tokenId)) {
            safeTransferFrom(from, to, data.tokenId);
        } else {
            mintAndTransfer(data, to);
        }
    }

    function mintAndTransfer(FunLibAsset.Mint721Data memory data, address to) public {
        address minter = msg.sender;
        address creator = data.creator;

        require(minter == creator || isApprovedForAll(creator, minter), "ERC721: transfer caller is not owner nor approved");

        /*
        Lazy minting will be suported soon...
        */

        bytes32 digest = _hash(address(this), data.creator, data.uri);
        require(_verify(digest, data.signature), "Invalid signature");

        _safeMint(to, _tokenIdCounter.current());
        _saveCreator(_tokenIdCounter.current(), creator, data.royalty);
        _setTokenURI(_tokenIdCounter.current(), data.uri);
        /* 
        Save royalty
        */
        _tokenIdCounter.increment();
    }

    function _hash(address collection, address creator, string memory uri)
    internal pure returns (bytes32)
    {
        return ECDSAUpgradeable.toEthSignedMessageHash(keccak256(abi.encodePacked(collection, creator, uri)));
    }

    function _verify(bytes32 digest, bytes memory signature)
    internal view returns (bool)
    {
        return owner() == ECDSAUpgradeable.recover(digest, signature);

    }

    function getThumbnail() external view returns(string memory) {
        return thumbnail;
    }
}