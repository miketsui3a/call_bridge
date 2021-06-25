pragma solidity 0.8.4;

contract Bridge{
  event Bridge(bytes data, address indexed from, address indexed to);
  function bridge(address to, bytes memory data)public {
    emit Bridge(data, msg.sender, to);
  }
}