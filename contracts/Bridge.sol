pragma solidity 0.8.4;

contract Bridge{
  event Bridge(address indexed from, address indexed to, bytes data);

  function bridge(address to, bytes memory data)public {
    emit Bridge(msg.sender, to, data);
  }
}