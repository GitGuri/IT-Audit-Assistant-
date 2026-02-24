import { useState, useCallback, useEffect } from 'react';
import { ColumnMappings, ParsedData, SavedMapping } from '../types';
import { loadMappingTemplates, saveMappingTemplate } from '../utils/storage';

const autoDetectColumn = (
  headers: string[],
  searchTerms: string[]
): string | '' => {
  const lowerHeaders = headers.map((h) => h.toLowerCase());
  
  for (const term of searchTerms) {
    const found = lowerHeaders.findIndex((h) => h.includes(term.toLowerCase()));
    if (found !== -1) {
      return headers[found];
    }
  }
  
  return '';
};

export const useColumnMapping = (
  currentUserlist: ParsedData | null,
  priorUserlist: ParsedData | null,
  engagementList: ParsedData | null,
  terminationList: ParsedData | null,
  testType: 'provision' | 'deprovision'
) => {
  const [mappings, setMappings] = useState<ColumnMappings>({
    currentUserlist: {
      username: '',
      employeeName: '',
      lastLoginDate: '',
      activeStatus: '',
      deactivationDate: '',
      dateAdded: '',
    },
  });

  const [savedMappings, setSavedMappings] = useState<SavedMapping[]>([]);
  const [saveMappingName, setSaveMappingName] = useState('');

  // Auto-detect columns when files are loaded
  useEffect(() => {
    if (currentUserlist) {
      setMappings((prev) => ({
        ...prev,
        currentUserlist: {
          username: autoDetectColumn(currentUserlist.headers, [
            'username',
            'user name',
            'user',
            'login',
            'id',
          ]),
          employeeName: autoDetectColumn(currentUserlist.headers, [
            'employee name',
            'name',
            'full name',
            'employee',
            'user name',
          ]),
          lastLoginDate: autoDetectColumn(currentUserlist.headers, [
            'last login',
            'last login date',
            'login date',
            'last access',
          ]),
          activeStatus: autoDetectColumn(currentUserlist.headers, [
            'status',
            'active',
            'state',
            'enabled',
          ]),
          deactivationDate: autoDetectColumn(currentUserlist.headers, [
            'deactivation',
            'deactivated',
            'disabled date',
            'deactivated date',
          ]),
          dateAdded: autoDetectColumn(currentUserlist.headers, [
            'date added',
            'created',
            'created date',
            'provisioned',
            'added date',
          ]),
        },
      }));
    }

    if (priorUserlist && testType === 'provision') {
      setMappings((prev) => ({
        ...prev,
        priorUserlist: {
          username: autoDetectColumn(priorUserlist.headers, [
            'username',
            'user name',
            'user',
            'login',
            'id',
          ]),
          employeeName: autoDetectColumn(priorUserlist.headers, [
            'employee name',
            'name',
            'full name',
            'employee',
            'user name',
          ]),
        },
      }));
    }

    if (engagementList && testType === 'provision') {
      setMappings((prev) => ({
        ...prev,
        engagementList: {
          employeeName: autoDetectColumn(engagementList.headers, [
            'employee name',
            'name',
            'full name',
            'employee',
            'user name',
          ]),
          engagementDate: autoDetectColumn(engagementList.headers, [
            'engagement date',
            'start date',
            'hire date',
            'onboarding',
            'start',
          ]),
        },
      }));
    }

    if (terminationList && testType === 'deprovision') {
      setMappings((prev) => ({
        ...prev,
        terminationList: {
          employeeName: autoDetectColumn(terminationList.headers, [
            'employee name',
            'name',
            'full name',
            'employee',
            'user name',
          ]),
          terminationDate: autoDetectColumn(terminationList.headers, [
            'termination date',
            'end date',
            'terminated',
            'exit date',
            'separation date',
          ]),
        },
      }));
    }
  }, [currentUserlist, priorUserlist, engagementList, terminationList, testType]);

  // Load saved mappings
  useEffect(() => {
    const loadMappings = async () => {
      const saved = await loadMappingTemplates(testType);
      setSavedMappings(saved);
    };
    loadMappings();
  }, [testType]);

  const updateMapping = useCallback(
    (path: string[], value: string) => {
      setMappings((prev) => {
        const newMappings = { ...prev };
        let current: any = newMappings;

        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }

        current[path[path.length - 1]] = value;
        return newMappings;
      });
    },
    []
  );

  const loadSavedMapping = useCallback((mapping: SavedMapping) => {
    setMappings(mapping.mappings);
  }, []);

  const saveMapping = useCallback(async () => {
    if (!saveMappingName.trim()) {
      return;
    }
    await saveMappingTemplate(saveMappingName, mappings, testType);
    const saved = await loadMappingTemplates(testType);
    setSavedMappings(saved);
    setSaveMappingName('');
  }, [saveMappingName, mappings, testType]);

  const isMappingComplete = useCallback((): boolean => {
    if (!currentUserlist) return false;

    const current = mappings.currentUserlist;
    if (!current.username || !current.employeeName) return false;

    if (testType === 'provision') {
      if (!priorUserlist || !engagementList) return false;
      if (!mappings.priorUserlist?.username || !mappings.priorUserlist?.employeeName)
        return false;
      if (!mappings.engagementList?.employeeName || !mappings.engagementList?.engagementDate)
        return false;
    } else {
      if (!terminationList) return false;
      if (!mappings.terminationList?.employeeName || !mappings.terminationList?.terminationDate)
        return false;
    }

    return true;
  }, [mappings, currentUserlist, priorUserlist, engagementList, terminationList, testType]);

  return {
    mappings,
    updateMapping,
    savedMappings,
    loadSavedMapping,
    saveMapping,
    saveMappingName,
    setSaveMappingName,
    isMappingComplete: isMappingComplete(),
  };
};



