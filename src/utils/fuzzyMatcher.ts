import { ratio } from 'fuzzball';
import { MatchResult, BestMatchResult } from '../types';

export const normalizeName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  
  let normalized = name.toLowerCase().trim();
  
  // Remove common titles
  normalized = normalized.replace(/\b(mr|mrs|ms|miss|dr|prof|sir|madam)\.?\s+/gi, '');
  
  // Handle "Last, First" format - convert to "First Last"
  const commaMatch = normalized.match(/^([^,]+),\s*(.+)$/);
  if (commaMatch) {
    normalized = `${commaMatch[2].trim()} ${commaMatch[1].trim()}`;
  }
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Remove special characters but keep spaces
  normalized = normalized.replace(/[^\w\s]/g, '');
  
  return normalized;
};

export const fuzzyMatchNames = (name1: string, name2: string): MatchResult => {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  if (!normalized1 || !normalized2) {
    return {
      isMatch: false,
      confidence: 0,
      name1,
      name2,
    };
  }
  
  // Use fuzzball ratio for similarity score (0-100)
  const score = ratio(normalized1, normalized2);
  
  return {
    isMatch: score >= 85, // 85% threshold
    confidence: score,
    name1,
    name2,
  };
};

export const findBestMatch = (
  targetName: string,
  records: Record<string, any>[],
  nameField: string,
  threshold: number = 85
): BestMatchResult | null => {
  if (!targetName || !nameField) return null;
  
  let bestMatch: BestMatchResult | null = null;
  let highestScore = 0;
  
  for (const record of records) {
    const recordName = record[nameField];
    if (!recordName) continue;
    
    const match = fuzzyMatchNames(targetName, recordName);
    
    if (match.confidence > highestScore && match.confidence >= threshold) {
      highestScore = match.confidence;
      bestMatch = {
        row: record,
        confidence: match.confidence,
      };
    }
  }
  
  return bestMatch;
};



