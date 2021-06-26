pragma solidity 0.8.4;

contract Bridge{
  event Bridge(bytes data, address indexed from, address indexed to, uint256 indexed networkId);
  function bridge(address to, bytes memory data, uint256 networkId)public {
    emit Bridge(data, msg.sender, to, networkId);
  }
}