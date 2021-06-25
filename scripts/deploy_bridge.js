const {ethers, artifacts} = require("hardhat");

const createConfig = require("./create_config")

async function deployBridge(){
  try{
    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = await Bridge.deploy();

    await bridge.deployed()

    console.log("Bridge address: ",bridge.address)
    createConfig({
      bridge: bridge.address
    }, "localhost")

    }catch(e){
      console.error(e)
  }
  
}


deployBridge()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });