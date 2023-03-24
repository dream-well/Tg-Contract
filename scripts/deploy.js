
const { ethers, upgrades } = require("hardhat");

async function main() {
  
  const contract = await upgrades.deployProxy(await ethers.getContractFactory("TGERC20"), 
  [
    "TiGer",
    "TG",
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  ], { initializer: 'init'});
  await contract.deployed();

  console.log("contract:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
