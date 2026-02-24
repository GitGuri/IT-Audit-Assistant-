import { useState, useCallback } from 'react';
import { FileUploadState, ParsedData } from '../types';
import { parseFile, validateFile } from '../utils/fileParser';

export const useFileUpload = () => {
  const [state, setState] = useState<FileUploadState>({
    file: null,
    parsedData: null,
    error: null,
    loading: false,
  });

  const uploadFile = useCallback(async (file: File) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setState({
        file: null,
        parsedData: null,
        error: validation.error || 'Invalid file',
        loading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const parsedData = await parseFile(file);
      setState({
        file,
        parsedData,
        error: null,
        loading: false,
      });
    } catch (error) {
      setState({
        file: null,
        parsedData: null,
        error: error instanceof Error ? error.message : 'Failed to parse file',
        loading: false,
      });
    }
  }, []);

  const removeFile = useCallback(() => {
    setState({
      file: null,
      parsedData: null,
      error: null,
      loading: false,
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      file: null,
      parsedData: null,
      error: null,
      loading: false,
    });
  }, []);

  return {
    ...state,
    uploadFile,
    removeFile,
    reset,
  };
};



