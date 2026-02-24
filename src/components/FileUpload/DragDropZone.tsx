import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { FileUploadState } from '../../types';

interface DragDropZoneProps {
  label: string;
  acceptedFormats: string[];
  state: FileUploadState;
  onFileAccepted: (file: File) => void;
  onRemove: () => void;
}

const dropZoneVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  active: { scale: 0.98 },
};

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  label,
  acceptedFormats,
  state,
  onFileAccepted,
  onRemove,
}) => {
  const borderColor = 'emerald.400';
  const hoverBorderColor = 'emerald.300';
  const bgColor = 'transparent';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    disabled: state.loading,
  });

  if (state.file && state.parsedData) {
    return (
      <Box
        p={4}
        borderWidth={2}
        borderColor="emerald.400"
        borderRadius="lg"
        bg="transparent"
        position="relative"
        backdropFilter="blur(10px)"
      >
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Icon as={FiFile} color="green.500" />
              <Text fontWeight="medium">{state.file.name}</Text>
            </HStack>
            <Icon
              as={FiX}
              cursor="pointer"
              onClick={onRemove}
              _hover={{ color: 'red.500' }}
            />
          </HStack>
          <Text fontSize="sm" color="emerald.300">
            {(state.file.size / 1024).toFixed(2)} KB • {state.parsedData.rows.length} rows
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <motion.div
      variants={dropZoneVariants}
      animate={isDragActive ? 'active' : 'idle'}
      whileHover="hover"
      style={{ width: '100%' }}
    >
      <Box
        {...getRootProps()}
        p={8}
        borderWidth={2}
        borderStyle="dashed"
        borderColor={isDragActive ? hoverBorderColor : borderColor}
        borderRadius="lg"
        bg="transparent"
        cursor={state.loading ? 'not-allowed' : 'pointer'}
        opacity={state.loading ? 0.6 : 1}
        transition="all 0.2s"
        backdropFilter="blur(10px)"
        _hover={{
          borderColor: hoverBorderColor,
          bg: 'rgba(76, 175, 80, 0.1)',
        }}
      >
        <input {...getInputProps()} />
        <VStack spacing={4}>
          {state.loading ? (
            <Spinner size="lg" color="emerald.400" />
          ) : (
            <Icon as={FiUpload} boxSize={10} color="emerald.400" />
          )}
          <VStack spacing={1}>
            <Text fontWeight="medium" fontSize="lg" color="white">
              {state.loading ? 'Processing...' : label}
            </Text>
            <Text fontSize="sm" color="emerald.300" textAlign="center">
              {state.loading
                ? 'Please wait while we parse your file'
                : 'Drag and drop a file here, or click to select'}
            </Text>
            <Text fontSize="xs" color="emerald.400" opacity={0.7}>
              Accepted: {acceptedFormats.join(', ')}
            </Text>
          </VStack>
          {state.error && (
            <Text fontSize="sm" color="red.400" textAlign="center">
              {state.error}
            </Text>
          )}
        </VStack>
      </Box>
    </motion.div>
  );
};

