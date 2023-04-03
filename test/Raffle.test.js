const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Raffle", function () {
  async function deploymentFixture() {
    const entranceFee = ethers.utils.parseEther("0.1");

    const [deployer, player1] = await ethers.getSigners();

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(entranceFee);
    await raffle.deployed();

    return { raffle, entranceFee, deployer, player1 };
  }

  describe("constructor", function () {
    it("Entrance fee is correct", async function () {
      const { raffle, entranceFee } = await loadFixture(deploymentFixture);
      expect(await raffle.getEntranceFee()).to.equal(entranceFee);
    });
  });

  describe("Enter raffle", function () {
    it("player is recorded after paying entrance fee", async function () {
      const { raffle, entranceFee, player1 } = await loadFixture(
        deploymentFixture
      );

      await raffle.connect(player1).enterRaffle({ value: entranceFee });

      expect(await raffle.getPlayer(0)).to.equal(player1.address);
    });

    it("players are recorded", async function () {
      const { raffle, entranceFee } = await loadFixture(deploymentFixture);

      accounts = await ethers.getSigners();

      for (i = 0; i < 6; i++) {
        await raffle.connect(accounts[i]).enterRaffle({ value: entranceFee });
      }

      for (i = 0; i < 6; i++) {
        expect(await raffle.getPlayer(i)).to.equal(accounts[i].address);
      }
    });

    it("amount is recorded with single player", async function () {
      const { raffle, entranceFee, player1 } = await loadFixture(
        deploymentFixture
      );

      await raffle.connect(player1).enterRaffle({ value: entranceFee });

      const raffleBalance = await ethers.provider.getBalance(raffle.address);

      expect(raffleBalance).to.equal(entranceFee);
    });

    it("amount is recorded with multiple players", async function () {
      const { raffle, entranceFee } = await loadFixture(deploymentFixture);

      accounts = await ethers.getSigners();

      for (i = 0; i < 6; i++) {
        await raffle.connect(accounts[i]).enterRaffle({ value: entranceFee });
      }

      const raffleBalance = await ethers.provider.getBalance(raffle.address);

      expect(raffleBalance).to.equal(entranceFee.mul(6));
    });

    it("event is emitted when player enters a raffle", async function () {
      const { raffle, entranceFee, player1 } = await loadFixture(
        deploymentFixture
      );

      expect(await raffle.connect(player1).enterRaffle({ value: entranceFee }))
        .to.emit(raffle, "RaffleEnter")
        .withArgs(player1.address);
    });

    it("not enough eth error is raised", async function () {
      const { raffle, entranceFee, player1 } = await loadFixture(
        deploymentFixture
      );

      notEnoughEntranceFee = entranceFee.sub(1000);

      await expect(
        raffle
          .connect(player1)
          .enterRaffle({ value: notEnoughEntranceFee })
      ).to.be.revertedWithCustomError(raffle, "Raffle__NotEnoughETHEntered");
    });
  });
});
