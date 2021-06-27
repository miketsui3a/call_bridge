
const config = require("../config/config.json")

describe.only("Bridge",function(){
    it("should emit event",async ()=>{
        // const Bridge = await ethers.getContractFactory("Bridge")
        const bridge = await ethers.getContractAt("Bridge",config["1337"].bridge)
        // const bridge = await Bridge.deploy()
        // await bridge.deployed()


        let ABI = [
            "function set(uint256 amount,address addr)"
        ];
        let iface = new ethers.utils.Interface(ABI);
        let data = iface.encodeFunctionData("set", [ 100 ,"0x4F2Ce57F0ddE8015b14B0F62A07d16A4a34667AF"])

        console.log(data)

        const tx = await bridge.bridge("0xe7DA83466F0bB83975e58F0FC78880B63dc8F774",data,3)
        console.log(await tx.wait())
        // console.log(tx)
    })
})