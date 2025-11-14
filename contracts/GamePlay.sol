// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract GamePlay is Ownable {
    uint256 public playFee = 0.0000001 ether;

    address public nftContract;
    address public vaultContract;

    mapping(address => uint256) public playerPlays;
    mapping(address => uint256) public playerWins;

    event GamePlayed(address indexed player, uint256 level);
    event GameWon(address indexed player, uint256 level);
    event PlayFeeUpdated(uint256 newFee);

    constructor(address _nftContract, address _vaultContract) Ownable(msg.sender) {
        nftContract = _nftContract;
        vaultContract = _vaultContract;
    }

    function play(uint256 level) external payable {
        require(level == 1 || level == 2, "Invalid level");
        require(msg.value >= playFee, "Insufficient play fee");

        // Check NFT ownership
        uint256 balance = IERC1155(nftContract).balanceOf(msg.sender, level);
        require(balance > 0, "Must own NFT for this level");

        playerPlays[msg.sender]++;

        emit GamePlayed(msg.sender, level);
    }

    function recordWin(address player, uint256 level) external {
        require(msg.sender == owner() || msg.sender == vaultContract, "Unauthorized");

        playerWins[player]++;
        emit GameWon(player, level);
    }

    function setPlayFee(uint256 newFee) external onlyOwner {
        playFee = newFee;
        emit PlayFeeUpdated(newFee);
    }

    function setContracts(address _nftContract, address _vaultContract) external onlyOwner {
        nftContract = _nftContract;
        vaultContract = _vaultContract;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}
