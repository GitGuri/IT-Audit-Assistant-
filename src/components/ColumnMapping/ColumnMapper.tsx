import {
  Box,
  VStack,
  HStack,
  Select,
  FormLabel,
  Text,
  Button,
  Input,
  Checkbox,
} from '@chakra-ui/react';
import { ParsedData, ColumnMappings } from '../../types';

interface ColumnMapperProps {
  currentUserlist: ParsedData | null;
  priorUserlist: ParsedData | null;
  engagementList: ParsedData | null;
  terminationList: ParsedData | null;
  mappings: ColumnMappings;
  onMappingChange: (path: string[], value: string) => void;
  testType: 'provision' | 'deprovision';
  savedMappings: any[];
  onLoadMapping: (mapping: any) => void;
  onSaveMapping: () => void;
  saveMappingName: string;
  onSaveMappingNameChange: (name: string) => void;
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  currentUserlist,
  priorUserlist,
  engagementList,
  terminationList,
  mappings,
  onMappingChange,
  testType,
  savedMappings,
  onLoadMapping,
  onSaveMapping,
  saveMappingName,
  onSaveMappingNameChange,
}) => {
  const renderSelect = (
    label: string,
    value: string,
    options: string[],
    onChange: (value: string) => void
  ) => (
    <Box>
      <FormLabel fontSize="sm" mb={1}>
        {label}
      </FormLabel>
      <Select
        size="sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Select column..."
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Box>
  );

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Map Columns
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Select the columns from your files that correspond to each required field.
        </Text>
      </Box>

      {savedMappings.length > 0 && (
        <Box p={4} bg="blue.50" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Load Previous Mapping:
          </Text>
          <Select
            size="sm"
            placeholder="Select a saved mapping..."
            onChange={(e) => {
              const mapping = savedMappings.find((m) => m.id === e.target.value);
              if (mapping) onLoadMapping(mapping);
            }}
          >
            {savedMappings.map((mapping) => (
              <option key={mapping.id} value={mapping.id}>
                {mapping.name || mapping.id} ({new Date(mapping.createdAt).toLocaleDateString()})
              </option>
            ))}
          </Select>
        </Box>
      )}

      {currentUserlist && (
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="medium" mb={3}>
            Current Year Userlist
          </Text>
          <VStack spacing={3} align="stretch">
            {renderSelect(
              'Username *',
              mappings.currentUserlist.username,
              currentUserlist.headers,
              (value) => onMappingChange(['currentUserlist', 'username'], value)
            )}
            {renderSelect(
              'Employee Name *',
              mappings.currentUserlist.employeeName,
              currentUserlist.headers,
              (value) => onMappingChange(['currentUserlist', 'employeeName'], value)
            )}
            {renderSelect(
              'Last Login Date',
              mappings.currentUserlist.lastLoginDate || '',
              ['', ...currentUserlist.headers],
              (value) => onMappingChange(['currentUserlist', 'lastLoginDate'], value)
            )}
            {renderSelect(
              'Active/Inactive Status',
              mappings.currentUserlist.activeStatus || '',
              ['', ...currentUserlist.headers],
              (value) => onMappingChange(['currentUserlist', 'activeStatus'], value)
            )}
            {renderSelect(
              'Deactivation Date',
              mappings.currentUserlist.deactivationDate || '',
              ['', ...currentUserlist.headers],
              (value) => onMappingChange(['currentUserlist', 'deactivationDate'], value)
            )}
            {testType === 'provision' &&
              renderSelect(
                'Date Added to System',
                mappings.currentUserlist.dateAdded || '',
                ['', ...currentUserlist.headers],
                (value) => onMappingChange(['currentUserlist', 'dateAdded'], value)
              )}
          </VStack>
        </Box>
      )}

      {testType === 'provision' && priorUserlist && (
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="medium" mb={3}>
            Prior Year Userlist
          </Text>
          <VStack spacing={3} align="stretch">
            {renderSelect(
              'Username *',
              mappings.priorUserlist?.username || '',
              priorUserlist.headers,
              (value) => onMappingChange(['priorUserlist', 'username'], value)
            )}
            {renderSelect(
              'Employee Name *',
              mappings.priorUserlist?.employeeName || '',
              priorUserlist.headers,
              (value) => onMappingChange(['priorUserlist', 'employeeName'], value)
            )}
          </VStack>
        </Box>
      )}

      {testType === 'provision' && engagementList && (
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="medium" mb={3}>
            Engagement List
          </Text>
          <VStack spacing={3} align="stretch">
            {renderSelect(
              'Employee Name *',
              mappings.engagementList?.employeeName || '',
              engagementList.headers,
              (value) => onMappingChange(['engagementList', 'employeeName'], value)
            )}
            {renderSelect(
              'Engagement Date *',
              mappings.engagementList?.engagementDate || '',
              engagementList.headers,
              (value) => onMappingChange(['engagementList', 'engagementDate'], value)
            )}
          </VStack>
        </Box>
      )}

      {testType === 'deprovision' && terminationList && (
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="medium" mb={3}>
            Termination List
          </Text>
          <VStack spacing={3} align="stretch">
            {renderSelect(
              'Employee Name *',
              mappings.terminationList?.employeeName || '',
              terminationList.headers,
              (value) => onMappingChange(['terminationList', 'employeeName'], value)
            )}
            {renderSelect(
              'Termination Date *',
              mappings.terminationList?.terminationDate || '',
              terminationList.headers,
              (value) => onMappingChange(['terminationList', 'terminationDate'], value)
            )}
          </VStack>
        </Box>
      )}

      <Box borderTop="1px" borderColor="gray.200" my={4} />

      <Box p={4} bg="gray.50" borderRadius="md">
        <VStack spacing={3} align="stretch">
          <Checkbox isChecked={saveMappingName.length > 0}>
            <HStack spacing={2}>
              <Text fontSize="sm">Save Mapping Template</Text>
              <Input
                size="sm"
                placeholder="Template name..."
                value={saveMappingName}
                onChange={(e) => onSaveMappingNameChange(e.target.value)}
                maxW="200px"
              />
              {saveMappingName.trim() && (
                <Button size="sm" colorScheme="blue" onClick={onSaveMapping}>
                  Save
                </Button>
              )}
            </HStack>
          </Checkbox>
        </VStack>
      </Box>
    </VStack>
  );
};


