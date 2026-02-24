export interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
  fileName: string;
}

export interface ColumnMappings {
  currentUserlist: {
    username: string;
    employeeName: string;
    lastLoginDate?: string;
    activeStatus?: string;
    deactivationDate?: string;
    dateAdded?: string;
  };
  priorUserlist?: {
    username: string;
    employeeName: string;
  };
  engagementList?: {
    employeeName: string;
    engagementDate: string;
  };
  terminationList?: {
    employeeName: string;
    terminationDate: string;
  };
}

export interface MatchResult {
  isMatch: boolean;
  confidence: number;
  name1: string;
  name2: string;
}

export interface BestMatchResult {
  row: Record<string, any>;
  confidence: number;
}

export interface ProvisionResult {
  username: string;
  employeeName: string;
  engagementDate: string;
  dateAddedToSystem: string;
  matchConfidence: number | null;
  isTimely: boolean | null;
}

export interface DeprovisionResult {
  username: string;
  employeeName: string;
  terminationDate: string;
  lastLoginDate: string;
  deactivationDate: string;
  isCompliant: boolean | null;
  complianceStatus: string;
  matchConfidence: number | null;
}

export interface SavedMapping {
  id: string;
  mappings: ColumnMappings;
  createdAt: string;
  name?: string;
}

export type TestMode = 'provision' | 'deprovision';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileUploadState {
  file: File | null;
  parsedData: ParsedData | null;
  error: string | null;
  loading: boolean;
}



