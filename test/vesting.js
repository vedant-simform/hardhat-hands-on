const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

describe("Test-cases for Vesting", () => {
  async function deploymentOfContract() {
    const vest = await ethers.getContractFactory("Vesting");
    const deployedVest = await vest.deploy();
    await deployedVest.deployed();

    const token = await ethers.getContractFactory("Token");
    const deployToken = await token.deploy();
    await deployToken.deployed();

    const [owner, acc1, acc2] = await ethers.getSigners();
    await deployToken.approve(deployedVest.address, 1000);
    await deployToken.transfer(acc1.address, 1000);
    await deployToken.transfer(acc2.address, 1000);
    await deployToken.connect(acc1).approve(deployedVest.address, 1000);
    await deployToken.connect(acc2).approve(deployedVest.address, 1000);

    return { deployedVest, deployToken };
  }
  describe("addVestingTokens Function Test Cases ", () => {
    it("Adding zero Amount", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );

      await expect(
        deployedVest.addVestingTokens(
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          0,
          0,
          0,
          0,
          0
        )
      ).to.revertedWith("Add some tokens");
    });
    it("Event emission", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployToken.approve(deployedVest.address, 100);
      await expect(
        deployedVest.addVestingTokens(
          deployToken.address,
          owner.address,
          10,
          0,
          0,
          100,
          0
        )
      )
        .to.emit(deployedVest, "DepositTokens")
        .withArgs(owner.address, deployedVest.address, 10);
    });

    it("Balance Updation", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      const userBalance = ethers.utils.formatEther(
        await deployToken.balanceOf(acc1.address)
      );
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        0,
        0,
        100,
        0
      );
      expect(
        ethers.utils.formatEther(await deployToken.balanceOf(acc1.address))
      ).to.equal(
        ethers.utils.formatEther(ethers.utils.parseEther(userBalance) - 10)
      );
    });
  });
  describe("calculateVestedAmount Function test cases", () => {
    it("All tokens must be return after vesting time ends", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        0,
        0,
        100,
        10
      );
      expect(
        await deployedVest.callStatic.calculateVestedAmount(acc1.address, 0)
      ).to.equal(10);
    });
    it("No token should be vested before first interval", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        1681131823,
        100,
        100,
        10
      );
      await expect(
        deployedVest.calculateVestedAmount(acc1.address, 0)
      ).to.revertedWith("No Token vested yet");
    });
  });
});
