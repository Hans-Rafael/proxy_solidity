// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract MyProxy is TransparentUpgradeableProxy {
    constructor(address _logic, address admin, bytes memory _data)
        TransparentUpgradeableProxy(_logic, admin, _data)
    {}

    // Agregar la función receive para manejar los pagos recibidos
    receive() external payable {}
}
