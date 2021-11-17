// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "../tokens/FunNFT.sol";

library FunLibAsset {

    struct Mint721Data {
        uint256 tokenId;
        string uri;
        address creator;
        bytes signature;
    }
}