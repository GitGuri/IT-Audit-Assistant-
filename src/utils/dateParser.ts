import { parse, isValid, isBefore, differenceInDays, format } from 'date-fns';

const DATE_FORMATS = [
  'dd/MM/yyyy',
  'MM/dd/yyyy',
  'yyyy-MM-dd',
  'dd-MM-yyyy',
  'MM-dd-yyyy',
  'dd.MM.yyyy',
  'yyyy/MM/dd',
  'dd/MM/yy',
  'MM/dd/yy',
  'yyyy-MM-dd HH:mm:ss',
  'dd/MM/yyyy HH:mm:ss',
  'MM/dd/yyyy HH:mm:ss',
];

export const parseDateFlexible = (dateString: string | null | undefined): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const trimmed = dateString.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'n/a' || trimmed.toLowerCase() === 'na') {
    return null;
  }

  // Try parsing with each format
  for (const formatStr of DATE_FORMATS) {
    try {
      const parsed = parse(trimmed, formatStr, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      // Continue to next format
    }
  }

  // Try native Date parsing as fallback
  try {
    const nativeDate = new Date(trimmed);
    if (isValid(nativeDate) && !isNaN(nativeDate.getTime())) {
      return nativeDate;
    }
  } catch {
    // Ignore
  }

  return null;
};

export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    return format(date, 'dd/MM/yyyy');
  } catch {
    return 'Invalid Date';
  }
};

export const checkTimelyAccess = (
  engagementDate: string | null | undefined,
  accessGrantedDate: string | null | undefined
): boolean | null => {
  const engagement = parseDateFlexible(engagementDate);
  const accessGranted = parseDateFlexible(accessGrantedDate);

  if (!engagement || !accessGranted) return null;

  const daysDifference = differenceInDays(accessGranted, engagement);
  // Access should be granted within 7 days after engagement, but not before
  return daysDifference <= 7 && daysDifference >= 0;
};

export const checkDeprovisionCompliance = (
  terminationDate: Date | null,
  lastLoginDate: Date | null,
  deactivationDate: Date | null
): boolean | null => {
  if (!terminationDate) return null;

  const lastLoginOk = lastLoginDate
    ? isBefore(lastLoginDate, terminationDate) ||
      lastLoginDate.getTime() === terminationDate.getTime()
    : true; // If no last login date, assume compliant

  const deactivationOk = deactivationDate
    ? isBefore(deactivationDate, terminationDate) ||
      deactivationDate.getTime() === terminationDate.getTime()
    : true; // If no deactivation date, assume compliant

  return lastLoginOk && deactivationOk;
};

export const getComplianceStatus = (
  isCompliant: boolean | null,
  terminationDate: Date | null,
  lastLoginDate: Date | null,
  deactivationDate: Date | null
): string => {
  if (isCompliant === null) {
    return 'Unable to determine - missing dates';
  }

  if (isCompliant) {
    return '✓ Compliant';
  }

  const issues: string[] = [];
  
  if (lastLoginDate && terminationDate && isBefore(terminationDate, lastLoginDate)) {
    issues.push('Login after termination');
  }
  
  if (deactivationDate && terminationDate && isBefore(terminationDate, deactivationDate)) {
    issues.push('Deactivation after termination');
  }

  return issues.length > 0 ? `⚠ ${issues.join(', ')}` : '⚠ Needs review';
};



