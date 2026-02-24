import { Button, HStack, Icon } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';
import { exportToExcel } from '../../utils/excelExporter';
import { ProvisionResult, DeprovisionResult } from '../../types';

interface ExportButtonProps {
  provisionResults?: ProvisionResult[];
  deprovisionResults?: DeprovisionResult[];
  testType: 'provision' | 'deprovision';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  provisionResults,
  deprovisionResults,
  testType,
}) => {
  const handleExport = () => {
    try {
      const results = testType === 'provision' ? provisionResults : deprovisionResults;
      if (!results || results.length === 0) {
        alert('No results to export');
        return;
      }

      const fileName = `IT_Auditor_${testType}`;
      exportToExcel(results, fileName, testType);
    } catch (error) {
      alert(`Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Button
      colorScheme="green"
      size="lg"
      leftIcon={<Icon as={FiDownload} />}
      onClick={handleExport}
    >
      Export to Excel
    </Button>
  );
};



