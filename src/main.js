const config = require("../config/localhost.json")
const { ethers } = require("hardhat");

const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8545')

const Stalker = require("./stalker.js")


async function main() {

    const mainProvider = ethers.getDefaultProvider("ws://localhost:8545")
    const sideProvider = ethers.getDefaultProvider("ws://localhost:8544")

    const stalker1 = new Stalker(mainProvider,sideProvider,config)
    stalker1.run()

}

main()  