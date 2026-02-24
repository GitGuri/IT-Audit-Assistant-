import { useState, useCallback } from 'react';
import {
  ProvisionResult,
  DeprovisionResult,
  ColumnMappings,
  ParsedData,
} from '../types';
import { processProvisionTest, processDeprovisionTest } from '../utils/dataProcessor';

export const useDataProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const [provisionResults, setProvisionResults] = useState<ProvisionResult[]>([]);
  const [deprovisionResults, setDeprovisionResults] = useState<DeprovisionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processProvision = useCallback(
    async (
      currentUserlist: ParsedData,
      priorUserlist: ParsedData,
      engagementList: ParsedData,
      mappings: ColumnMappings
    ) => {
      setProcessing(true);
      setError(null);

      try {
        // Use setTimeout to allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 100));

        const results = processProvisionTest(
          currentUserlist,
          priorUserlist,
          engagementList,
          mappings
        );

        setProvisionResults(results);
        setProcessing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process data');
        setProcessing(false);
      }
    },
    []
  );

  const processDeprovision = useCallback(
    async (
      currentUserlist: ParsedData,
      terminationList: ParsedData,
      mappings: ColumnMappings
    ) => {
      setProcessing(true);
      setError(null);

      try {
        // Use setTimeout to allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 100));

        const results = processDeprovisionTest(
          currentUserlist,
          terminationList,
          mappings
        );

        setDeprovisionResults(results);
        setProcessing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process data');
        setProcessing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setProvisionResults([]);
    setDeprovisionResults([]);
    setError(null);
    setProcessing(false);
  }, []);

  return {
    processing,
    provisionResults,
    deprovisionResults,
    error,
    processProvision,
    processDeprovision,
    reset,
  };
};



