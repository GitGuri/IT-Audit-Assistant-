import * as XLSX from 'xlsx';
import { ProvisionResult, DeprovisionResult } from '../types';

export const exportToExcel = (
  data: ProvisionResult[] | DeprovisionResult[],
  fileName: string,
  testType: 'provision' | 'deprovision'
): void => {
  try {
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths (optional - basic implementation)
    const maxWidth = 30;
    const wscols = Object.keys(data[0] || {}).map(() => ({
      wch: maxWidth,
    }));
    ws['!cols'] = wscols;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      testType === 'provision' ? 'Provisioned Users' : 'Deprovisioned Users'
    );

    // Generate file name with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFileName = `${fileName}_${testType}_${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(wb, fullFileName);
  } catch (error) {
    throw new Error(
      `Failed to export Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};



