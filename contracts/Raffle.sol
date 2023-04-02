// Raffle

// Enter the lottery (paying some amount)
// Pick a random number (verifiable random)
// winner to be selected every X minutes -> completely automated
// chainlink oracle -> randomness, automated execution (chainlink keeper)

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Raffle {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    event PlayerRegistered(address indexed player);
    error Raffle_NotEnoughETHEntered();

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        // check enough amount or revert with error
        if (msg.value < i_entranceFee) {
            revert Raffle_NotEnoughETHEntered();
        }

        // include sender in the list of players
        s_players.push(payable(msg.sender));

        // emit an event
        emit PlayerRegistered(msg.sender);
    }

    // function pickRandomWinner() returns () {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
