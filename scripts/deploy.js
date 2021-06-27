const {ethers, artifacts} = require("hardhat");
const createConfig = require("./create_config")
const secret = require("../config/secret.json")

async function deploy(){
  try{
    // const signer = (await ethers.getSigners())[0]

    const chainId = (await ethers.provider.getNetwork()).chainId
    const multiSigWalletOwnerAddr = ethers.utils.computeAddress(secret[chainId].privateKey)

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = await Bridge.deploy();
    await bridge.deployed()
    console.log("Bridge address: ",bridge.address)


    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy([multiSigWalletOwnerAddr],1);
    await multiSigWallet.deployed()
    console.log("MultiSigWallet address: ", multiSigWallet.address)


    createConfig({
      chainId: ethers.provider._network.chainId,
      bridge: bridge.address,
      multiSigWallet: multiSigWallet.address
    }, ethers.provider._network.chainId)

    }catch(e){
      console.error(e)
  }
  
}


deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });