export const PHARMA_NFT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // TODO: Update this after deployment

export const PHARMA_NFT_ABI = [
  "function mintMedicine(address recipient, string memory tokenURI, string memory _medicineId, string memory _batchNumber, string memory _manufacturer, string memory _expiryDate, string memory _manufacturingDate) public returns (uint256)",
  "function getMedicineDetails(uint256 tokenId) public view returns (tuple(string medicineId, string batchNumber, string manufacturer, string expiryDate, string manufacturingDate))",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "event MedicineMinted(uint256 indexed tokenId, string batchNumber, address manufacturer)"
];
