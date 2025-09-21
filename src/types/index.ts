export interface Certificate {
  hash: string;
  studentId: string;
  studentName: string;
  course: string;
  grade: string;
  ipfsHash: string;
  issuer: string;
  timestamp: number;
  exists: boolean;
}

export interface CertificateForm {
  studentId: string;
  studentName: string;
  course: string;
  grade: string;
  file?: File;
}

export interface UserRole {
  type: 'admin' | 'student' | 'verifier';
  address: string;
  name: string;
}

export interface BlockchainState {
  connected: boolean;
  account: string | null;
  contract: any;
  provider: any;
}