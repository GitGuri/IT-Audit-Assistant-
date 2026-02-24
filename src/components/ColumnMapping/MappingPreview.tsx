import { Box, Text, VStack } from '@chakra-ui/react';
import { FilePreview } from '../FileUpload/FilePreview';
import { ParsedData } from '../../types';

interface MappingPreviewProps {
  currentUserlist: ParsedData | null;
  priorUserlist: ParsedData | null;
  engagementList: ParsedData | null;
  terminationList: ParsedData | null;
  testType: 'provision' | 'deprovision';
}

export const MappingPreview: React.FC<MappingPreviewProps> = ({
  currentUserlist,
  priorUserlist,
  engagementList,
  terminationList,
  testType,
}) => {
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="md" fontWeight="semibold">
        File Previews
      </Text>

      {currentUserlist && <FilePreview data={currentUserlist} />}

      {testType === 'provision' && priorUserlist && (
        <FilePreview data={priorUserlist} />
      )}

      {testType === 'provision' && engagementList && (
        <FilePreview data={engagementList} />
      )}

      {testType === 'deprovision' && terminationList && (
        <FilePreview data={terminationList} />
      )}
    </VStack>
  );
};



