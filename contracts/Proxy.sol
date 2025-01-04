// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;
    event Upgraded(address indexed newImplementation);
    event FallbackCalled(bytes data, bytes returnData, bool success);
    event FallbackError(string reason);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function upgrade(address newImplementation) public {
        implementation = newImplementation;
        emit Upgraded(newImplementation);
    }

    function getImplementation() public view returns (address) {
        return implementation;
    }

    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "Implementation contract not set");
        (bool success, bytes memory data) = impl.delegatecall(msg.data);
        if (success) {
            emit FallbackCalled(msg.data, data, success);
            assembly {
                return(add(data, 32), mload(data))
            }
        } else {
            emit FallbackError("Delegatecall failed");
            revert("Delegatecall failed");
        }
    }

    receive() external payable {}
}
