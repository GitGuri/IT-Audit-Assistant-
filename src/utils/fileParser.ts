import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import Papa from 'papaparse';
import { ParsedData } from '../types';

// Configure PDF.js worker - use CDN or local worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export const parseExcelFile = async (file: File): Promise<ParsedData> => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

    if (data.length === 0) {
      throw new Error('Excel file is empty or has no data');
    }

    return {
      headers: Object.keys(data[0] as Record<string, any>),
      rows: data as Record<string, any>[],
      fileName: file.name,
    };
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const parseCSVFile = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }

        const rows = results.data as Record<string, any>[];
        if (rows.length === 0) {
          reject(new Error('CSV file is empty or has no data'));
          return;
        }

        resolve({
          headers: Object.keys(rows[0]),
          rows: rows,
          fileName: file.name,
        });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      },
    });
  });
};

export const parsePDFFile = async (file: File): Promise<ParsedData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let allText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      allText += pageText + '\n';
    }

    // Try to parse as table (simple approach - split by lines and whitespace)
    const lines = allText.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      throw new Error('PDF file appears to be empty or contains no extractable text');
    }

    // Try to detect headers (first non-empty line)
    const headerLine = lines[0];
    const headers = headerLine.split(/\s{2,}|\t/).map(h => h.trim()).filter(h => h.length > 0);
    
    if (headers.length === 0) {
      // Fallback: use first line as single header
      headers.push('Column1');
    }

    // Parse remaining lines as rows
    const rows: Record<string, any>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/\s{2,}|\t/).map(v => v.trim());
      const row: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      // Only add row if it has at least one non-empty value
      if (Object.values(row).some(v => v && v.toString().trim().length > 0)) {
        rows.push(row);
      }
    }

    if (rows.length === 0) {
      throw new Error('PDF file contains no table data');
    }

    return {
      headers,
      rows,
      fileName: file.name,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const parseFile = async (file: File): Promise<ParsedData> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.csv') || fileType === 'text/csv') {
    return parseCSVFile(file);
  } else if (
    fileName.endsWith('.xlsx') ||
    fileName.endsWith('.xls') ||
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileType === 'application/vnd.ms-excel'
  ) {
    return parseExcelFile(file);
  } else if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
    return parsePDFFile(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType || 'unknown'}`);
  }
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/pdf',
  ];

  const fileName = file.name.toLowerCase();
  const isValidExtension =
    fileName.endsWith('.xlsx') ||
    fileName.endsWith('.xls') ||
    fileName.endsWith('.csv') ||
    fileName.endsWith('.pdf');

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  if (!isValidExtension && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only Excel (.xlsx, .xls), CSV, and PDF files are allowed',
    };
  }

  return { valid: true };
};

