// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFTUpgradeable.sol";

contract NFTDefaultApproval is NFTUpgradeable {
    mapping(address => bool) private defaultApprovals;

    event DefaultApproval(address indexed operator, bool hasApproval);
    
    // override approval function
    function _setDefaultApproval(address operator, bool hasApproval) internal {
        defaultApprovals[operator] = hasApproval;
        emit DefaultApproval(operator, hasApproval);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal virtual override view returns (bool) {
        return defaultApprovals[spender] || super._isApprovedOrOwner(spender, tokenId);
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return defaultApprovals[operator] || super.isApprovedForAll(owner, operator);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}