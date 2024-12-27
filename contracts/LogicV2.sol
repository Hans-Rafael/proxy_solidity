// SPDX-License-Identifier: MIT
// contracts/LogicV2.sol
pragma solidity ^0.8.0;

contract LogicV2 {
    uint public number;

    function setNumber(uint _number) public {
        number = _number * 2; // Cambiamos la lógica
    }

    function getNumber() public view returns (uint256) {
        return number;
    }

    function getDouble() public view returns (uint) {
        return number * 2;
    }
}
