import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xF47fcA724A491a5b1563d14A6dfb86B2697a3d77";

export const ABI = [
  "function register(string,string)",
  "function getUser(address) view returns (string,string,address)",
  "function isRegistered(address) view returns (bool)",
];

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};
