import {
  Box,
  VStack,
  Button,
  HStack,
  Text,
  Progress,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useColumnMapping } from '../../hooks/useColumnMapping';
import { useDataProcessing } from '../../hooks/useDataProcessing';
import { DragDropZone } from '../FileUpload/DragDropZone';
import { ColumnMapper } from '../ColumnMapping/ColumnMapper';
import { MappingPreview } from '../ColumnMapping/MappingPreview';
import { ResultsTable } from '../Results/ResultsTable';
import { ExportButton } from '../Results/ExportButton';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const DeprovisionTest: React.FC = () => {
  const {
    currentUserlist,
    setCurrentUserlist,
    terminationList,
    setTerminationList,
  } = useApp();

  const currentUpload = useFileUpload();
  const terminationUpload = useFileUpload();

  const {
    mappings,
    updateMapping,
    savedMappings,
    loadSavedMapping,
    saveMapping,
    saveMappingName,
    setSaveMappingName,
    isMappingComplete,
  } = useColumnMapping(
    currentUserlist,
    null,
    null,
    terminationList,
    'deprovision'
  );

  const {
    processing,
    deprovisionResults,
    error,
    processDeprovision,
    reset: resetProcessing,
  } = useDataProcessing();

  const [step, setStep] = useState<'upload' | 'mapping' | 'results'>('upload');

  const handleCurrentUpload = async (file: File) => {
    await currentUpload.uploadFile(file);
    if (currentUpload.parsedData) {
      setCurrentUserlist(currentUpload.parsedData);
    }
  };

  const handleTerminationUpload = async (file: File) => {
    await terminationUpload.uploadFile(file);
    if (terminationUpload.parsedData) {
      setTerminationList(terminationUpload.parsedData);
    }
  };

  const handleProcess = async () => {
    if (!currentUserlist || !terminationList) return;

    await processDeprovision(currentUserlist, terminationList, mappings);
    setStep('results');
  };

  // Check both context state and upload hook state to ensure files are ready
  const allFilesUploaded =
    (currentUserlist || currentUpload.parsedData) &&
    (terminationList || terminationUpload.parsedData) &&
    !currentUpload.loading &&
    !terminationUpload.loading &&
    !currentUpload.error &&
    !terminationUpload.error;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box
        position="relative"
        minH="100vh"
        bg="#0a0a0a"
        _before={{
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/axsdc.png)',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          backgroundSize: '200px 200px',
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
        <Text fontSize="2xl" fontWeight="bold">
          User Deprovision Testing
        </Text>
        <Text color="gray.600">
          Compare current userlist against termination list to verify timely deprovisioning.
        </Text>

        {step === 'upload' && (
          <VStack spacing={6} align="stretch">
            <DragDropZone
              label="Current Userlist"
              acceptedFormats={['.xlsx', '.xls', '.csv', '.pdf']}
              state={currentUpload}
              onFileAccepted={handleCurrentUpload}
              onRemove={() => {
                currentUpload.removeFile();
                setCurrentUserlist(null);
              }}
            />

            <DragDropZone
              label="Termination List"
              acceptedFormats={['.xlsx', '.xls', '.csv', '.pdf']}
              state={terminationUpload}
              onFileAccepted={handleTerminationUpload}
              onRemove={() => {
                terminationUpload.removeFile();
                setTerminationList(null);
              }}
            />

            <Button
              bg="emerald.800"
              color="white"
              size="lg"
              disabled={!allFilesUploaded}
              border="2px solid"
              borderColor="emerald.400"
              _hover={{ bg: 'emerald.700', borderColor: 'emerald.300' }}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              onClick={() => {
                // Ensure context is updated before navigating
                if (currentUpload.parsedData && !currentUserlist) {
                  setCurrentUserlist(currentUpload.parsedData);
                }
                if (terminationUpload.parsedData && !terminationList) {
                  setTerminationList(terminationUpload.parsedData);
                }
                setStep('mapping');
              }}
            >
              Next: Map Columns
            </Button>
          </VStack>
        )}

        {step === 'mapping' && (
          <VStack spacing={6} align="stretch">
            <MappingPreview
              currentUserlist={currentUserlist}
              priorUserlist={null}
              engagementList={null}
              terminationList={terminationList}
              testType="deprovision"
            />

            <Box borderTop="1px" borderColor="gray.200" my={4} />

            <ColumnMapper
              currentUserlist={currentUserlist}
              priorUserlist={null}
              engagementList={null}
              terminationList={terminationList}
              mappings={mappings}
              onMappingChange={updateMapping}
              testType="deprovision"
              savedMappings={savedMappings}
              onLoadMapping={loadSavedMapping}
              onSaveMapping={saveMapping}
              saveMappingName={saveMappingName}
              onSaveMappingNameChange={setSaveMappingName}
            />

            <HStack spacing={4}>
              <Button onClick={() => setStep('upload')}>Back</Button>
              <Button
                colorScheme="green"
                disabled={!isMappingComplete || processing}
                onClick={handleProcess}
              >
                {processing ? 'Processing...' : 'Process Data'}
              </Button>
            </HStack>

            {processing && (
              <Box>
                <Progress isIndeterminate colorScheme="blue" />
                <Text mt={2} fontSize="sm" color="gray.600">
                  Processing data... This may take a moment for large files.
                </Text>
              </Box>
            )}

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        )}

        {step === 'results' && (
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
              <Button onClick={() => setStep('mapping')}>Back to Mapping</Button>
              <ExportButton
                deprovisionResults={deprovisionResults}
                testType="deprovision"
              />
            </HStack>

            <ResultsTable
              deprovisionResults={deprovisionResults}
              testType="deprovision"
            />
          </VStack>
        )}
        </VStack>
      </Box>
    </motion.div>
  );
};


