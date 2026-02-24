import { ParsedData, ColumnMappings, ProvisionResult, DeprovisionResult } from '../types';
import { findBestMatch } from './fuzzyMatcher';
import {
  parseDateFlexible,
  checkTimelyAccess,
  checkDeprovisionCompliance,
  getComplianceStatus,
} from './dateParser';

export const processProvisionTest = (
  currentUserlist: ParsedData,
  priorUserlist: ParsedData,
  engagementList: ParsedData,
  mappings: ColumnMappings
): ProvisionResult[] => {
  // Step 1: Compare current vs prior userlist to find new users
  const newUsers = currentUserlist.rows.filter((currentUser) => {
    const username = currentUser[mappings.currentUserlist.username];
    if (!username) return false;

    return !priorUserlist.rows.some((priorUser) => {
      const priorUsername = priorUser[mappings.priorUserlist?.username || ''];
      return priorUsername === username;
    });
  });

  // Step 2: Match new users against engagement list
  const results: ProvisionResult[] = newUsers.map((user) => {
    const userName = user[mappings.currentUserlist.employeeName] || '';
    const username = user[mappings.currentUserlist.username] || 'N/A';

    // Find match in engagement list (with fuzzy matching)
    const match = findBestMatch(
      userName,
      engagementList.rows,
      mappings.engagementList?.employeeName || '',
      85
    );

    const engagementDate = match
      ? match.row[mappings.engagementList?.engagementDate || ''] || 'N/A'
      : 'N/A';

    const dateAddedToSystem =
      user[mappings.currentUserlist.dateAdded || ''] || 'N/A';

    const isTimely = checkTimelyAccess(engagementDate, dateAddedToSystem);

    return {
      username,
      employeeName: userName || 'N/A',
      engagementDate,
      dateAddedToSystem,
      matchConfidence: match ? match.confidence : null,
      isTimely,
    };
  });

  return results;
};

export const processDeprovisionTest = (
  currentUserlist: ParsedData,
  terminationList: ParsedData,
  mappings: ColumnMappings
): DeprovisionResult[] => {
  // Match termination list against userlist
  const results: DeprovisionResult[] = terminationList.rows.map((termRecord) => {
    const terminatedName =
      termRecord[mappings.terminationList?.employeeName || ''] || '';

    // Find match in userlist (with fuzzy matching)
    const match = findBestMatch(
      terminatedName,
      currentUserlist.rows,
      mappings.currentUserlist.employeeName,
      85
    );

    if (!match) {
      return {
        username: 'Not Found',
        employeeName: terminatedName || 'N/A',
        terminationDate:
          termRecord[mappings.terminationList?.terminationDate || ''] || 'N/A',
        lastLoginDate: 'N/A',
        deactivationDate: 'N/A',
        isCompliant: false,
        complianceStatus: 'User not found in system',
        matchConfidence: null,
      };
    }

    const terminationDateStr =
      termRecord[mappings.terminationList?.terminationDate || ''] || '';
    const termDate = parseDateFlexible(terminationDateStr);
    const lastLogin = parseDateFlexible(
      match.row[mappings.currentUserlist.lastLoginDate || '']
    );
    const deactivationDate = parseDateFlexible(
      match.row[mappings.currentUserlist.deactivationDate || '']
    );

    // Check compliance
    const isCompliant = checkDeprovisionCompliance(
      termDate,
      lastLogin,
      deactivationDate
    );

    return {
      username: match.row[mappings.currentUserlist.username] || 'N/A',
      employeeName: terminatedName || 'N/A',
      terminationDate: terminationDateStr || 'N/A',
      lastLoginDate:
        match.row[mappings.currentUserlist.lastLoginDate || ''] || 'N/A',
      deactivationDate:
        match.row[mappings.currentUserlist.deactivationDate || ''] || 'N/A',
      isCompliant,
      complianceStatus: getComplianceStatus(
        isCompliant,
        termDate,
        lastLogin,
        deactivationDate
      ),
      matchConfidence: match.confidence,
    };
  });

  return results;
};


