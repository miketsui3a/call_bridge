const { ethers } = require("hardhat");
const multiSigWalletJson = require("../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json")

module.exports = class Stalker {

    constructor(mainWeb3, sideWeb3s, config, network, secret) {
        this.mainWeb3 = mainWeb3
        this.sideWeb3s = sideWeb3s
        this.config = config
        this.network = network
        this.secret = secret

        this.sideMultiSigWallets = {}
        for ([key, value] of Object.entries(sideWeb3s)) {
            this.sideMultiSigWallets[key] = new value.eth.Contract(multiSigWalletJson.abi, config[key].multiSigWallet)
        }

    }

    
    // getSideMultiSigWalletsByChainId(chainId,sideMultiSigWallets){
    //     for([key, value] of Object.entries(sideMultiSigWallets)){
    //         if(key == chainId){
    //             return value
    //         }
    //     }
    // }


    async run() {
        // console.log(this.sideWeb3s["1338"].eth.accounts.wallet.add("0x8497f7865e8135314a0e64d4455c40c9ee46895732fd674b5dc9ce8978944c49"))
        // console.log(await this.sideWeb3s["1338"].eth.getAccounts())

        const sideMultiSigWallets = this.sideMultiSigWallets
        const sideWeb3s = this.sideWeb3s

        var subscription = this.mainWeb3.eth.subscribe('logs', {
            address: this.config[this.network].bridge,
        }, async function (error, result) {
            if (!error) {   
                // console.log(result);
                const from = "0x" + result.topics[1].slice(26)
                const to = "0x" + result.topics[2].slice(26)
                const networkId = result.topics[3]
                const data = "0x" + result.data.slice(130, -56)

                let sideMultiSigWallet
                for([key, value] of Object.entries(sideMultiSigWallets)){
                    if(key == parseInt(networkId)){
                        console.log("bingo")
                        sideMultiSigWallet=value
                        break
                    }
                }

                let sideWeb3
                for([key, value] of Object.entries(sideWeb3s)){
                    if(key == parseInt(networkId)){
                        console.log("bingo")
                        sideWeb3=value
                        break
                    }
                }

                console.log(sideWeb3.eth.accounts.wallet['0'].address)
                
                const tx = await sideMultiSigWallet.methods.submitTransaction(result.transactionHash, to, 0, data).send({
                    from: sideWeb3.eth.accounts.wallet['0'].address,
                    gas: 999999
                })
                console.log(tx)
                
            } else {
                console.error(error)
            }
        });

    }

}