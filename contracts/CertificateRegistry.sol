// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        string studentId;
        string studentName;
        string course;
        string grade;
        string ipfsHash;
        address issuer;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    mapping(string => string[]) public studentCertificates; // studentId => certificate hashes
    
    address public owner;
    
    event CertificateIssued(
        string indexed certificateHash,
        string indexed studentId,
        string studentName,
        address indexed issuer
    );
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Not an authorized issuer");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }
    
    function authorizeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }
    
    function revokeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer);
    }
    
    function issueCertificate(
        string memory _certificateHash,
        string memory _studentId,
        string memory _studentName,
        string memory _course,
        string memory _grade,
        string memory _ipfsHash
    ) external onlyAuthorizedIssuer {
        require(!certificates[_certificateHash].exists, "Certificate already exists");
        require(bytes(_certificateHash).length > 0, "Certificate hash cannot be empty");
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");
        
        certificates[_certificateHash] = Certificate({
            studentId: _studentId,
            studentName: _studentName,
            course: _course,
            grade: _grade,
            ipfsHash: _ipfsHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        studentCertificates[_studentId].push(_certificateHash);
        
        emit CertificateIssued(_certificateHash, _studentId, _studentName, msg.sender);
    }
    
    function verifyCertificate(string memory _certificateHash) external view returns (
        string memory studentId,
        string memory studentName,
        string memory course,
        string memory grade,
        string memory ipfsHash,
        address issuer,
        uint256 timestamp,
        bool exists
    ) {
        Certificate memory cert = certificates[_certificateHash];
        return (
            cert.studentId,
            cert.studentName,
            cert.course,
            cert.grade,
            cert.ipfsHash,
            cert.issuer,
            cert.timestamp,
            cert.exists
        );
    }
    
    function getStudentCertificates(string memory _studentId) external view returns (string[] memory) {
        return studentCertificates[_studentId];
    }
    
    function getCertificateCount(string memory _studentId) external view returns (uint256) {
        return studentCertificates[_studentId].length;
    }
}