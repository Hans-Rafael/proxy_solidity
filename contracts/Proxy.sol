// SPDX-License-Identifier: MIT
// contracts/Proxy.sol
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function upgrade(address newImplementation) public {
        implementation = newImplementation;
    }

    fallback() external payable {
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }
}
