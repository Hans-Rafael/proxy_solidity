// SPDX-License-Identifier: MIT
// contracts/LogicV1.sol
pragma solidity ^0.8.0;

contract LogicV1 {
    uint public number;

    function setNumber(uint _number) public {
        number = _number;
    }
}
