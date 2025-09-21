# CertiChain - Blockchain Certificate Verification System

A comprehensive blockchain-based academic certificate issuance and verification system built with React, TypeScript, and Ethereum smart contracts.

## 🚀 Features

### Admin Panel
- Issue new certificates with blockchain security
- Upload certificate files to IPFS
- Generate unique certificate hashes
- Store immutable records on Ethereum blockchain

### Student Dashboard
- View all issued certificates
- Share verification links with employers
- Download certificate files
- Copy certificate hashes for verification

### Verification Portal
- Instant certificate authenticity verification
- Public verification without login required
- Detailed certificate information display
- Blockchain-powered tamper-proof validation

## 🏗️ Architecture

### Smart Contract (Solidity)
- `CertificateRegistry.sol` - Main contract for certificate management
- Role-based access control for authorized issuers
- Event logging for certificate issuance
- Gas-optimized storage and retrieval

### Frontend (React + TypeScript)
- Modern, responsive UI with Tailwind CSS
- Role-based navigation and access control
- Real-time blockchain interaction
- IPFS integration for file storage

### Blockchain Integration
- Ethereum blockchain for certificate storage
- MetaMask/Web3 wallet integration
- Ethers.js for smart contract interaction
- Local development with Ganache

## 📋 Smart Contract Setup

### Using Remix IDE

1. **Open Remix IDE**: Visit [https://remix.ethereum.org](https://remix.ethereum.org)

2. **Create Contract File**:
   - Create a new file: `contracts/CertificateRegistry.sol`
   - Copy the contract code from `contracts/CertificateRegistry.sol`

3. **Compile Contract**:
   - Go to the "Solidity Compiler" tab
   - Select compiler version 0.8.19+
   - Click "Compile CertificateRegistry.sol"

4. **Deploy Contract**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" or "Remix VM (Cancun)" for testing
   - Deploy the `CertificateRegistry` contract
   - Copy the deployed contract address

5. **Update Frontend**:
   - Replace `CONTRACT_ADDRESS` in `src/services/blockchain.ts` with your deployed contract address

### Contract Functions

```solidity
// Issue a new certificate (Admin only)
function issueCertificate(
    string memory _certificateHash,
    string memory _studentId,
    string memory _studentName,
    string memory _course,
    string memory _grade,
    string memory _ipfsHash
) external onlyAuthorizedIssuer

// Verify certificate authenticity
function verifyCertificate(string memory _certificateHash) external view returns (...)

// Get student's certificates
function getStudentCertificates(string memory _studentId) external view returns (string[] memory)
```

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd certichain

# Install dependencies
npm install

# Start development server
npm run dev
```

## 💡 Usage Guide

### For University Admins
1. Select "Admin" role in the navigation
2. Fill in student details and course information
3. Upload certificate file (PDF or image)
4. Click "Issue Certificate" to store on blockchain
5. Share the generated certificate hash with the student

### For Students
1. Select "Student" role in the navigation  
2. Enter your student ID to search for certificates
3. View all your blockchain-verified certificates
4. Share verification links with employers or institutions
5. Download or view original certificate files

### For Verifiers (Employers/Institutions)
1. Select "Verifier" role in the navigation
2. Enter the certificate hash provided by the student
3. Click "Verify Certificate" for instant authentication
4. View detailed certificate information if valid
5. Access original certificate file via IPFS

## 🔐 Security Features

- **Immutable Records**: Once stored on blockchain, certificates cannot be altered
- **Role-Based Access**: Only authorized issuers can create certificates  
- **Hash Verification**: Unique hashes prevent duplication and ensure authenticity
- **Decentralized Storage**: IPFS ensures file availability and integrity
- **Transparent Verification**: Anyone can verify certificate authenticity

## 🌐 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, Solidity 0.8.19+
- **Web3**: Ethers.js v6
- **Storage**: IPFS (InterPlanetary File System)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📊 Demo Data

The application includes mock data for demonstration:
- **Student ID**: `ST2024001` (pre-populated)
- **Certificate Hash**: `cert123` (pre-populated)
- **Sample certificates** available for testing verification

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting platform
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Smart Contract Deployment
1. Deploy to Ethereum testnet (Goerli, Sepolia) or mainnet
2. Update contract address in frontend configuration
3. Ensure sufficient ETH for gas fees

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@certichain.com or join our Discord community.

---

**CertiChain** - Making academic credentials trustworthy, transparent, and instantly verifiable through blockchain technology.