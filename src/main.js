const config = require("../config/config.json")
const secret = require("../config/secret.json")
const { ethers } = require("hardhat");

const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8545')

const Stalker = require("./stalker.js")


async function main() {

    const network = process.argv[2]

    const mainWeb3 = new Web3('ws://'+secret[network].url)
    let sideWeb3s = {}
    for([key,value] of Object.entries(secret)){
        if(key!=network){
            sideWeb3s[key] = new Web3('ws://'+value.url)
            sideWeb3s[key].eth.accounts.wallet.add(value.privateKey)
        }
    }

    const stalker1 = new Stalker(mainWeb3, sideWeb3s, config, network, secret)
    stalker1.run()

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});