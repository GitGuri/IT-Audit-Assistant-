import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  HStack,
  Input,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { ProvisionResult, DeprovisionResult } from '../../types';

interface ResultsTableProps {
  provisionResults?: ProvisionResult[];
  deprovisionResults?: DeprovisionResult[];
  testType: 'provision' | 'deprovision';
}

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.02 },
  }),
};

export const ResultsTable: React.FC<ResultsTableProps> = ({
  provisionResults,
  deprovisionResults,
  testType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const results = testType === 'provision' ? provisionResults : deprovisionResults;

  const filteredAndSortedResults = useMemo(() => {
    if (!results) return [];

    let filtered = results.filter((result) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        result.employeeName.toLowerCase().includes(searchLower) ||
        (result.username && result.username.toLowerCase().includes(searchLower))
      );
    });

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as any)[sortField];
        const bValue = (b as any)[sortField];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison =
          typeof aValue === 'string'
            ? aValue.localeCompare(bValue)
            : aValue - bValue;

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [results, searchTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const stats = useMemo(() => {
    if (!results) return null;

    if (testType === 'provision') {
      const provisionResults = results as ProvisionResult[];
      const timely = provisionResults.filter((r) => r.isTimely === true).length;
      const untimely = provisionResults.filter((r) => r.isTimely === false).length;
      const unknown = provisionResults.filter((r) => r.isTimely === null).length;

      return {
        total: provisionResults.length,
        timely,
        untimely,
        unknown,
      };
    } else {
      const deprovisionResults = results as DeprovisionResult[];
      const compliant = deprovisionResults.filter((r) => r.isCompliant === true).length;
      const nonCompliant = deprovisionResults.filter((r) => r.isCompliant === false).length;
      const unknown = deprovisionResults.filter((r) => r.isCompliant === null).length;

      return {
        total: deprovisionResults.length,
        compliant,
        nonCompliant,
        unknown,
      };
    }
  }, [results, testType]);

  if (!results || results.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No results to display</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {stats && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Stat>
            <StatLabel>Total Records</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </Stat>
          {testType === 'provision' ? (
            <>
              <Stat>
                <StatLabel>Timely Access</StatLabel>
                <StatNumber color="green.500">{stats.timely}</StatNumber>
                <StatHelpText>Within 7 days</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Untimely Access</StatLabel>
                <StatNumber color="red.500">{stats.untimely}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Unknown</StatLabel>
                <StatNumber color="gray.500">{stats.unknown}</StatNumber>
              </Stat>
            </>
          ) : (
            <>
              <Stat>
                <StatLabel>Compliant</StatLabel>
                <StatNumber color="green.500">{stats.compliant}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Non-Compliant</StatLabel>
                <StatNumber color="red.500">{stats.nonCompliant}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Unknown</StatLabel>
                <StatNumber color="gray.500">{stats.unknown}</StatNumber>
              </Stat>
            </>
          )}
        </SimpleGrid>
      )}

      <Input
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="md"
      />

      <Box overflowX="auto" borderWidth={1} borderRadius="md">
        <Table size="sm" variant="striped">
          <Thead>
            <Tr>
              {testType === 'provision' ? (
                <>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('username')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Username {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('employeeName')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Employee Name {sortField === 'employeeName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('engagementDate')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Engagement Date {sortField === 'engagementDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('dateAddedToSystem')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Date Added {sortField === 'dateAddedToSystem' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Match Confidence</Th>
                  <Th>Status</Th>
                </>
              ) : (
                <>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('username')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Username {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('employeeName')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Employee Name {sortField === 'employeeName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleSort('terminationDate')}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Termination Date {sortField === 'terminationDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Last Login</Th>
                  <Th>Deactivation Date</Th>
                  <Th>Compliance Status</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {filteredAndSortedResults.map((result, index) => (
              <Tr
                key={index}
                as={motion.tr}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                {testType === 'provision' ? (
                  <>
                    <Td>{(result as ProvisionResult).username}</Td>
                    <Td>{(result as ProvisionResult).employeeName}</Td>
                    <Td>{(result as ProvisionResult).engagementDate}</Td>
                    <Td>{(result as ProvisionResult).dateAddedToSystem}</Td>
                    <Td>
                      {(result as ProvisionResult).matchConfidence !== null ? (
                        <Badge colorScheme="blue">
                          {Math.round((result as ProvisionResult).matchConfidence || 0)}%
                        </Badge>
                      ) : (
                        <Text color="gray.400">N/A</Text>
                      )}
                    </Td>
                    <Td>
                      {(result as ProvisionResult).isTimely === true ? (
                        <Badge colorScheme="green">✓ Timely</Badge>
                      ) : (result as ProvisionResult).isTimely === false ? (
                        <Badge colorScheme="red">⚠ Untimely</Badge>
                      ) : (
                        <Badge colorScheme="gray">Unknown</Badge>
                      )}
                    </Td>
                  </>
                ) : (
                  <>
                    <Td>{(result as DeprovisionResult).username}</Td>
                    <Td>{(result as DeprovisionResult).employeeName}</Td>
                    <Td>{(result as DeprovisionResult).terminationDate}</Td>
                    <Td>{(result as DeprovisionResult).lastLoginDate}</Td>
                    <Td>{(result as DeprovisionResult).deactivationDate}</Td>
                    <Td>
                      {(result as DeprovisionResult).isCompliant === true ? (
                        <Badge colorScheme="green">✓ Compliant</Badge>
                      ) : (result as DeprovisionResult).isCompliant === false ? (
                        <Badge colorScheme="red">
                          {(result as DeprovisionResult).complianceStatus}
                        </Badge>
                      ) : (
                        <Badge colorScheme="gray">Unknown</Badge>
                      )}
                    </Td>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Text fontSize="sm" color="gray.600">
        Showing {filteredAndSortedResults.length} of {results.length} results
      </Text>
    </VStack>
  );
};

