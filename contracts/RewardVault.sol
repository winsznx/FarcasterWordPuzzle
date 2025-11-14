// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract RewardVault is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public signerAddress;

    // Track used nonces to prevent replay attacks
    mapping(bytes32 => bool) public usedNonces;

    // Reward token slots (2 tokens per vault)
    struct RewardToken {
        address tokenAddress;
        uint256 maxClaimAmount;
    }

    RewardToken[2] public rewardTokens;
    uint256 public totalClaims;
    uint256 public maxTotalClaims = 100;

    event RewardClaimed(
        address indexed user,
        uint256 token1Amount,
        uint256 token2Amount,
        uint256 wctAmount,
        uint256 celoAmount
    );
    event RewardTokenUpdated(uint8 slot, address token, uint256 maxClaim);
    event SignerUpdated(address newSigner);

    constructor(address _signerAddress) Ownable(msg.sender) {
        signerAddress = _signerAddress;
    }

    function claim(
        bytes memory databytes,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(totalClaims < maxTotalClaims, "Maximum claims reached");

        // Decode the data (2 tokens)
        (
            uint256 token1Amount,
            uint256 token2Amount,
            bytes32 nonce,
            uint256 timestamp
        ) = abi.decode(databytes, (uint256, uint256, bytes32, uint256));

        // Check nonce not used
        require(!usedNonces[nonce], "Nonce already used");

        // Verify timestamp (valid for 1 hour)
        require(block.timestamp <= timestamp + 3600, "Signature expired");

        // Verify signature
        bytes32 messageHash = keccak256(databytes);
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recovered = ecrecover(ethSignedMessageHash, v, r, s);

        require(recovered == signerAddress, "Invalid signature");

        // Mark nonce as used
        usedNonces[nonce] = true;
        totalClaims++;

        // Transfer rewards
        if (token1Amount > 0 && rewardTokens[0].tokenAddress != address(0)) {
            IERC20(rewardTokens[0].tokenAddress).transfer(msg.sender, token1Amount);
        }

        if (token2Amount > 0 && rewardTokens[1].tokenAddress != address(0)) {
            IERC20(rewardTokens[1].tokenAddress).transfer(msg.sender, token2Amount);
        }

        emit RewardClaimed(msg.sender, token1Amount, token2Amount, 0, 0);
    }

    function updateRewardToken(
        uint8 slot,
        address token,
        uint256 maxClaim
    ) external onlyOwner {
        require(slot < 2, "Invalid slot");
        rewardTokens[slot] = RewardToken(token, maxClaim);
        emit RewardTokenUpdated(slot, token, maxClaim);
    }

    function updateSigner(address newSigner) external onlyOwner {
        signerAddress = newSigner;
        emit SignerUpdated(newSigner);
    }

    function withdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }

    receive() external payable {}
}
