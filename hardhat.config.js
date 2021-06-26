require("@nomiclabs/hardhat-waffle");



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",  
  networks:{
    ganache1:{
      url:"http://localhost:8545",
      accounts:{
        mnemonic: "song ice copper resemble donate essay evidence runway warfare insane wisdom reflect"
      }
    },
    ganache2:{
      url:"http://localhost:8544",
      accounts:{
        mnemonic: "song ice copper resemble donate essay evidence runway warfare insane wisdom reflect"
      }
    },
    rinkeby:{
    url:"https://rinkeby.infura.io/v3/50aa19ab84df4855923c094d5b4d0c2a",
      accounts:{
        mnemonic: "song ice copper resemble donate essay evidence runway warfare insane wisdom reflect"
      }
    },
    ropsten:{
      url:"https://ropsten.infura.io/v3/50aa19ab84df4855923c094d5b4d0c2a",
      accounts:{
        mnemonic: "song ice copper resemble donate essay evidence runway warfare insane wisdom reflect"
      }
    },
    bscTest:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts:{
        mnemonic: "song ice copper resemble donate essay evidence runway warfare insane wisdom reflect"
      }
    }
  }
};

