const { ethers } = require("hardhat");

module.exports = class Stalker{

    constructor(mainProvider, sideProvider, config){
        this.mainProvider = mainProvider
        this.sideProvider = sideProvider
        this.config = config
    }

    async run(){
        const Bridge = await ethers.getContractFactory("Bridge")
        const mainSigner = await this.mainProvider.listAccounts().then((accounts) => {
            let signer =this. mainProvider.getSigner(accounts[0]);
            return signer;
        });
    
        const sideSigner = await this.sideProvider.listAccounts().then((accounts) => {
            let signer = this.sideProvider.getSigner(accounts[0]);
            return signer;
        });

        const multiSigWallet = await ethers.getContractAt("MultiSigWallet",this.config.multiSigWallet,sideSigner)


        const filter = {
            address: this.config.bridge,
            topics: Object.keys(Bridge.interface.events).map(key=>ethers.utils.id(key))
        }
        this.mainProvider.on(filter, async (_data) => {
            const from = "0x"+_data.topics[1].slice(26)
            const to = "0x"+_data.topics[2].slice(26)
            const data = "0x"+_data.data.slice(130,-56)

            console.log(_data.transactionHash)
    
            const tx = await multiSigWallet.submitTransaction(_data.transactionHash,to,0,data)
            console.log(await tx.wait())

            // console.log(data)
            // console.log(to)
    
            // const tx = {
            //     to,
            //     data,
            // }
    
            // const rst = await sideSigner.sendTransaction(tx)
            // console.log(rst)
            // console.log(await rst.wait())

        })
    }

}