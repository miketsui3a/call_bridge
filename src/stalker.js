const { ethers } = require("hardhat");
const secret = require("../config/secret.json")

module.exports = class Stalker {

    constructor(mainProvider, sideProvider, config, network, secret) {
        this.mainProvider = mainProvider
        this.sideProvider = sideProvider
        this.config = config
        this.network = network
        this.secret = secret
    }

    async run() {
        const Bridge = await ethers.getContractFactory("Bridge")

        const sideWallet = new ethers.Wallet(secret[this.network].privateKey, this.sideProvider);
        const multiSigWallet = await ethers.getContractAt("MultiSigWallet", this.config["1338"].multiSigWallet)

        const filter = {
            address: this.config[this.network].bridge,
            topics: Object.keys(Bridge.interface.events).map(key => ethers.utils.id(key))
        }
        this.mainProvider.on(filter, async (_data) => {
            const from = "0x" + _data.topics[1].slice(26)
            const to = "0x" + _data.topics[2].slice(26)
            const networkId =  _data.topics[3]
            const data = "0x" + _data.data.slice(130, -56)
            console.log(parseInt(networkId))
            const tx = await multiSigWallet.connect(sideWallet).submitTransaction(_data.transactionHash, to, 0, data)
            // console.log(await tx.wait())

        })


    }

    getWallets(providers, secret) {
        let sideWallets = {}
        for (const [key, provider] of Object.entries(providers)) {
            sideWallets[key] = new ethers.Wallet(secret[key].privateKey, provider);
        }
    }

}