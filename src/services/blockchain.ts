import { ethers } from 'ethers';

const CONTRACT_ABI = [
  "function issueCertificate(string _certificateHash, string _studentId, string _studentName, string _course, string _grade, string _ipfsHash) external",
  "function verifyCertificate(string _certificateHash) external view returns (string, string, string, string, string, address, uint256, bool)",
  "function getStudentCertificates(string _studentId) external view returns (string[])",
  "function authorizedIssuers(address) external view returns (bool)",
  "function owner() external view returns (address)",
  "event CertificateIssued(string indexed certificateHash, string indexed studentId, string studentName, address indexed issuer)"
];

// This would be replaced with your deployed contract address
const CONTRACT_ADDRESS = "0x..."; // Replace with actual deployed contract address

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private mockCertificates: Record<string, any> = {};
  private mockStudentCertificates: Record<string, string[]> = {};

  async connectWallet(): Promise<{ account: string; provider: any }> {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        const account = await this.signer.getAddress();
        
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
        
        return { account, provider: this.provider };
      } catch (error) {
        throw new Error('Failed to connect wallet');
      }
    } else {
      // For demo purposes, create a mock connection
      return { account: '0x1234567890123456789012345678901234567890', provider: 'mock' };
    }
  }

  async issueCertificate(
    certificateHash: string,
    studentId: string,
    studentName: string,
    course: string,
    grade: string,
    ipfsHash: string
  ): Promise<string> {
    if (!this.contract) {
      // Store in mock storage
      this.mockCertificates[certificateHash] = {
        studentId,
        studentName,
        course,
        grade,
        ipfsHash,
        issuer: '0x1234567890123456789012345678901234567890',
        timestamp: Date.now(),
        exists: true
      };
      
      // Add to student's certificate list
      if (!this.mockStudentCertificates[studentId]) {
        this.mockStudentCertificates[studentId] = [];
      }
      this.mockStudentCertificates[studentId].push(certificateHash);
      
      return Promise.resolve('mock-tx-hash');
    }

    try {
      const tx = await this.contract.issueCertificate(
        certificateHash,
        studentId,
        studentName,
        course,
        grade,
        ipfsHash
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new Error('Failed to issue certificate');
    }
  }

  async verifyCertificate(certificateHash: string): Promise<any> {
    if (!this.contract) {
      // Return from mock storage
      return this.mockCertificates[certificateHash] || {
        studentId: '',
        studentName: '',
        course: '',
        grade: '',
        ipfsHash: '',
        issuer: '0x0000000000000000000000000000000000000000',
        timestamp: 0,
        exists: false
      };
    }

    try {
      const result = await this.contract.verifyCertificate(certificateHash);
      return {
        studentId: result[0],
        studentName: result[1],
        course: result[2],
        grade: result[3],
        ipfsHash: result[4],
        issuer: result[5],
        timestamp: Number(result[6]),
        exists: result[7]
      };
    } catch (error) {
      throw new Error('Failed to verify certificate');
    }
  }

  async getStudentCertificates(studentId: string): Promise<string[]> {
    if (!this.contract) {
      // Return from mock storage
      return this.mockStudentCertificates[studentId] || [];
    }

    try {
      return await this.contract.getStudentCertificates(studentId);
    } catch (error) {
      throw new Error('Failed to fetch student certificates');
    }
  }

  // Initialize with some demo data
  constructor() {
    // Add demo certificate
    this.mockCertificates['cert123'] = {
      studentId: 'ST2024001',
      studentName: 'John Doe',
      course: 'Computer Science',
      grade: 'A',
      ipfsHash: 'QmX1234567890abcdef',
      issuer: '0x1234567890123456789012345678901234567890',
      timestamp: Date.now(),
      exists: true
    };
    
    this.mockStudentCertificates['ST2024001'] = ['cert123'];
  }
}

export const blockchainService = new BlockchainService();