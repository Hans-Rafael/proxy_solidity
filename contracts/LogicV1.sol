// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LogicV1 {
    uint public number;

    function setNumber(uint _number) public {
        number = _number;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}
