import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { ParsedData } from '../../types';

interface FilePreviewProps {
  data: ParsedData;
  maxRows?: number;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  data,
  maxRows = 5,
}) => {
  const displayRows = data.rows.slice(0, maxRows);

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        Preview: {data.fileName} ({data.rows.length} total rows)
      </Text>
      <Box overflowX="auto" borderWidth={1} borderRadius="md">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              {data.headers.map((header, index) => (
                <Th key={index} whiteSpace="nowrap">
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {displayRows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {data.headers.map((header, colIndex) => (
                  <Td key={colIndex} maxW="200px" overflow="hidden" textOverflow="ellipsis">
                    {String(row[header] || '')}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {data.rows.length > maxRows && (
        <Text fontSize="xs" color="gray.500" mt={2}>
          Showing first {maxRows} of {data.rows.length} rows
        </Text>
      )}
    </Box>
  );
};



