const config = require("../config/config.json")
const secret = require("../config/secret.json")
const { ethers } = require("hardhat");

const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8545')

const Stalker = require("./stalker.js")


async function main() {

    const network = process.argv[2]

    let validNetwork = false
    const keys = Object.keys(secret)
    for (key of keys) {
        if (key == network) {
            validNetwork = true
            break
        }
    }

    if (!validNetwork) {
        throw new Error("wrong network")
    }

    const mainProvider = new ethers.providers.WebSocketProvider("ws://" + secret[network].url)


    const sideProvider = new ethers.providers.WebSocketProvider("ws://localhost:8544")
    const stalker1 = new Stalker(mainProvider, sideProvider, config, network, secret)
    stalker1.run()

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});