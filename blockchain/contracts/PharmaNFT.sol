// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PharmaNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct MedicineData {
        string medicineId;
        string batchNumber;
        string manufacturer;
        string expiryDate;
        string manufacturingDate;
    }

    // Mapping from token ID to medicine details
    mapping(uint256 => MedicineData) public medicineDetails;

    event MedicineMinted(uint256 indexed tokenId, string batchNumber, address manufacturer);

    constructor(address initialOwner) ERC721("PharmaScan", "PHRM") Ownable(initialOwner) {}

    function mintMedicine(
        address recipient,
        string memory tokenURI,
        string memory _medicineId,
        string memory _batchNumber,
        string memory _manufacturer,
        string memory _expiryDate,
        string memory _manufacturingDate
    ) public returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        medicineDetails[tokenId] = MedicineData({
            medicineId: _medicineId,
            batchNumber: _batchNumber,
            manufacturer: _manufacturer,
            expiryDate: _expiryDate,
            manufacturingDate: _manufacturingDate
        });

        emit MedicineMinted(tokenId, _batchNumber, msg.sender);

        return tokenId;
    }

    function getMedicineDetails(uint256 tokenId) public view returns (MedicineData memory) {
        return medicineDetails[tokenId];
    }
}
