// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameNFT is ERC1155, Ownable {
    uint256 public constant LEVEL_1 = 1;
    uint256 public constant LEVEL_2 = 2;

    uint256 public mintPrice = 0.000003 ether;

    // Track which addresses have minted each token ID
    mapping(address => mapping(uint256 => bool)) public hasMinted;

    event NFTMinted(address indexed user, uint256 indexed tokenId);
    event MintPriceUpdated(uint256 newPrice);

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mint(uint256 tokenId) external payable {
        require(tokenId == LEVEL_1 || tokenId == LEVEL_2, "Invalid token ID");
        require(!hasMinted[msg.sender][tokenId], "Already minted this level");
        require(msg.value >= mintPrice, "Insufficient payment");

        hasMinted[msg.sender][tokenId] = true;
        _mint(msg.sender, tokenId, 1, "");

        emit NFTMinted(msg.sender, tokenId);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    function uri(uint256 tokenId) public pure override returns (string memory) {
        return string(abi.encodePacked("https://your-domain.com/metadata/",
            tokenId == LEVEL_1 ? "1" : "2", ".json"));
    }
}
