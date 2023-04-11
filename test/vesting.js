const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");
const exp = require("constants");

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
    it("User must add some tokens", async () => {
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
    it("Slice Period must be less than Vesting period", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );

      await expect(
        deployedVest.addVestingTokens(
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          10,
          0,
          0,
          10,
          100
        )
      ).to.revertedWith("Slice Period must be less than Vesting period");
    });
    it("Event emission of DepositTokens", async () => {
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

    it("Balance Updation of User after token vested", async () => {
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
    it("Balance Updation of Contract after token vested", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      const contractBalance = ethers.utils.formatEther(
        await deployToken.balanceOf(deployedVest.address)
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
        ethers.utils.formatEther(
          await deployToken.balanceOf(deployedVest.address)
        )
      ).to.equal(
        ethers.utils.formatEther(
          ethers.utils.parseEther(contractBalance).add("10")
        )
      );
    });
  });
  describe("CalculateVestedAmount Function test cases", () => {
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
        1691186667,
        100,
        100,
        10
      );
      await expect(
        deployedVest.calculateVestedAmount(acc1.address, 0)
      ).to.revertedWith("No Token vested yet");
    });
    it("No tokens should be relased after all tokens get released", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        0,
        100,
        100,
        10
      );
      await deployedVest.calculateVestedAmount(acc1.address, 0);
      await expect(
        deployedVest.calculateVestedAmount(acc1.address, 0)
      ).to.revertedWith("All Tokens are released");
    });
    it("Event emission for VestedTokens", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        0,
        100,
        100,
        10
      );
      await expect(deployedVest.calculateVestedAmount(acc1.address, 0))
        .to.emit(deployedVest, "VestedTokens")
        .withArgs(acc1.address, 10);
    });
  });
  describe("Withdraw function test cases", () => {
    it("Non benificier can't withdraw", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        0,
        100,
        100,
        10
      );
      await expect(deployedVest.withdraw(acc1.address, 10, 0)).to.revertedWith(
        "Only benificiar can withdraw"
      );
    });
    it("Only benificiar can withdraw", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        0,
        100,
        100,
        10
      );
      await expect(
        deployedVest.connect(acc1).withdraw(acc1.address, 10, 0)
      ).not.to.be.revertedWith("Only benificiar can withdraw");
    });
    it("Withdrawable amount must be more than zero to withdraw", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        10,
        1691186667,
        100,
        100,
        10
      );
      await expect(
        deployedVest.connect(acc1).withdraw(acc1.address, 10, 0)
      ).to.revertedWith("No amount to be withdrawn");
    });
    it("User balance should be increse after withdraw", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();

      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        100,
        0,
        100,
        100,
        10
      );
      const userBalance = ethers.utils.formatEther(
        await deployToken.balanceOf(acc1.address)
      );
      await deployedVest.releaseTokens(acc1.address, 0);
      await deployedVest.connect(acc1).withdraw(acc1.address, 100, 0);
      expect(
        ethers.utils.formatEther(await deployToken.balanceOf(acc1.address))
      ).to.equal(
        ethers.utils.formatEther(
          ethers.utils.parseEther(userBalance).add("100")
        )
      );
    });
    it("Event Emission for WithdrawTokens", async () => {
      const { deployedVest, deployToken } = await loadFixture(
        deploymentOfContract
      );
      const [owner, acc1, acc2] = await ethers.getSigners();
      await deployedVest.addVestingTokens(
        deployToken.address,
        acc1.address,
        100,
        0,
        100,
        100,
        10
      );
      await deployedVest.releaseTokens(acc1.address, 0);
      await expect(deployedVest.connect(acc1).withdraw(acc1.address, 100, 0))
        .to.emit(deployedVest, "WithdrawTokens")
        .withArgs(acc1.address, 100);
    });
  });
});
