// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        string txHash,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, string txHash);
    event RevokeConfirmation(address indexed owner, string txHash);
    event ExecuteTransaction(address indexed owner, string txHash);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(string => mapping(address => bool)) public isConfirmed;
    mapping(string=>Transaction) public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }


    modifier notExecuted(string memory txHash) {
        require(!transactions[txHash].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(string memory txHash) {
        require(!isConfirmed[txHash][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "ownerxs required");
        require(
            _numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    receive() payable external {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(string memory txHash, address _to, uint _value, bytes memory _data)
        public
        onlyOwner
    {
        if(transactions[txHash].to!=address(0)){
            confirmTransaction(txHash);
            return;
        }

        transactions[txHash] = Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        });

        emit SubmitTransaction(msg.sender, txHash, _to, _value, _data);
    }

    function confirmTransaction(string memory txHash)
        public
        onlyOwner
        notExecuted(txHash)
        notConfirmed(txHash)
    {
        Transaction storage transaction = transactions[txHash];
        transaction.numConfirmations += 1;
        isConfirmed[txHash][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, txHash);

        if(transaction.numConfirmations>=numConfirmationsRequired){
            executeTransaction(txHash);
        }
    }

    function executeTransaction(string memory txHash)
        public
        onlyOwner
        notExecuted(txHash)
    {
        Transaction storage transaction = transactions[txHash];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, txHash);
    }

    function revokeConfirmation(string memory txHash)
        public
        onlyOwner
        notExecuted(txHash)
    {
        Transaction storage transaction = transactions[txHash];

        require(isConfirmed[txHash][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[txHash][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, txHash);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransaction(string memory txHash)
        public
        view
        returns (address to, uint value, bytes memory data, bool executed, uint numConfirmations)
    {
        Transaction storage transaction = transactions[txHash];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}
