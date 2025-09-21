// Mock IPFS service for demo purposes
// In production, this would connect to actual IPFS nodes

class IPFSService {
  private mockStorage: Map<string, { file: File; hash: string }> = new Map();

  async uploadFile(file: File): Promise<string> {
    // Generate a mock IPFS hash
    const hash = `Qm${Math.random().toString(36).substring(2, 46)}`;
    
    // Store file in mock storage
    this.mockStorage.set(hash, { file, hash });
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return hash;
  }

  async getFile(hash: string): Promise<File | null> {
    const stored = this.mockStorage.get(hash);
    return stored ? stored.file : null;
  }

  getFileUrl(hash: string): string {
    // In production, this would return an IPFS gateway URL
    return `https://ipfs.io/ipfs/${hash}`;
  }

  // Pre-populate with some mock certificates for demo
  constructor() {
    // Add some mock certificates
    const mockCert1 = new File(['Mock Certificate Content 1'], 'certificate1.pdf', { type: 'application/pdf' });
    this.mockStorage.set('QmX1234567890abcdef', { file: mockCert1, hash: 'QmX1234567890abcdef' });
  }
}

export const ipfsService = new IPFSService();