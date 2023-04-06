const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Vesting Contract", function () {
  async function deploymentOfContract() {
    const Vest = await ethers.getContractFactory("Vesting");
    const deployedVest = await Vest.deploy(
      "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    );
    return { deployedVest };
  }

  it("Token must be chainlink", async () => {
    const { deployedVest } = await loadFixture(deploymentOfContract);
    const chainLinkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    expect(await deployedVest.token()).to.equal(chainLinkTokenAddress);
  });

  //   it("Vesting amount should't be zero", async () => {});
});
