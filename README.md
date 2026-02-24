# IT Auditor Assistant Tool

A Progressive Web App (PWA) for IT auditors to automate GITC (General IT Controls) testing. The tool tests user access provision and deprovision by comparing userlists against engagement and termination lists. **All processing happens locally in your browser - no data is sent to any server.**

## Features

- **User Provision Testing**: Compare current year userlist with prior year to find new users, then match against engagement list
- **User Deprovision Testing**: Verify timely deprovisioning by comparing current userlist against termination list
- **Multiple File Format Support**: Excel (.xlsx, .xls), CSV, and PDF files
- **Fuzzy String Matching**: Intelligent name matching with confidence scoring
- **Flexible Date Parsing**: Handles multiple date formats automatically
- **Column Mapping**: Auto-detect and manual mapping of columns with template saving
- **Results Export**: Export results to Excel with detailed analysis
- **Offline Capable**: Works as a PWA with offline functionality
- **Privacy First**: All processing happens client-side - no backend server required

## Installation

### For Development

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (typically `http://localhost:5173`)

### For Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. The `dist` folder contains all the files needed for deployment
3. Serve the `dist` folder using any web server (e.g., nginx, Apache, or a simple HTTP server)
4. For local use, you can simply open `dist/index.html` in a browser (note: some features may require a local server due to CORS)

## Usage Guide

### User Provision Testing

1. **Select Test Mode**: Click "User Provision Testing" on the home page
2. **Upload Files**:
   - Current Year Userlist (required)
   - Prior Year Userlist (required)
   - Engagement List (required)
3. **Map Columns**: 
   - Review the auto-detected column mappings
   - Adjust mappings if needed
   - Optionally save mapping template for future use
4. **Process Data**: Click "Process Data" to run the analysis
5. **Review Results**: 
   - View summary statistics
   - Review detailed results table
   - Export to Excel if needed

### User Deprovision Testing

1. **Select Test Mode**: Click "User Deprovision Testing" on the home page
2. **Upload Files**:
   - Current Userlist (required)
   - Termination List (required)
3. **Map Columns**: 
   - Review the auto-detected column mappings
   - Adjust mappings if needed
   - Optionally save mapping template for future use
4. **Process Data**: Click "Process Data" to run the analysis
5. **Review Results**: 
   - View compliance status for each terminated user
   - Review detailed results table
   - Export to Excel if needed

## Column Mapping

### Required Columns for Provision Testing

**Current Year Userlist:**
- Username (required)
- Employee Name (required)
- Date Added to System (optional, for timely access check)
- Last Login Date (optional)
- Active/Inactive Status (optional)
- Deactivation Date (optional)

**Prior Year Userlist:**
- Username (required)
- Employee Name (required)

**Engagement List:**
- Employee Name (required)
- Engagement Date (required)

### Required Columns for Deprovision Testing

**Current Userlist:**
- Username (required)
- Employee Name (required)
- Last Login Date (optional, for compliance check)
- Deactivation Date (optional, for compliance check)

**Termination List:**
- Employee Name (required)
- Termination Date (required)

## Data Processing Logic

### Provision Testing

1. Identifies new users by comparing current year userlist with prior year userlist
2. Matches new users against engagement list using fuzzy string matching (85% threshold)
3. Checks if access was granted within 7 days of engagement date
4. Provides match confidence scores for fuzzy matches

### Deprovision Testing

1. Matches termination list against current userlist using fuzzy string matching
2. Checks compliance by verifying:
   - Last login date is on or before termination date
   - Deactivation date is on or before termination date
3. Flags non-compliant cases for review
4. Provides match confidence scores for fuzzy matches

## File Format Support

### Excel Files (.xlsx, .xls)
- Fully supported
- Reads first sheet by default
- Handles empty cells gracefully

### CSV Files (.csv)
- Fully supported
- Auto-detects headers
- Handles various delimiters

### PDF Files (.pdf)
- Basic table extraction supported
- Works best with well-structured tables
- May require manual verification for complex layouts

## Troubleshooting

### File Upload Issues

**Problem**: File upload fails or shows error
- **Solution**: Ensure file is under 50MB and in supported format (.xlsx, .xls, .csv, .pdf)

**Problem**: PDF parsing doesn't work correctly
- **Solution**: PDF table extraction works best with simple, well-structured tables. Consider converting to Excel format for better results.

### Column Mapping Issues

**Problem**: Auto-detection doesn't find correct columns
- **Solution**: Manually select the correct columns from the dropdown menus

**Problem**: Required columns are missing
- **Solution**: Ensure your files contain the required columns (see Column Mapping section above)

### Processing Issues

**Problem**: Processing takes too long
- **Solution**: For very large files (10,000+ rows), processing may take time. The progress indicator will show status.

**Problem**: Results show "N/A" or "Unknown"
- **Solution**: This is normal when optional columns are missing or dates cannot be parsed. Review your column mappings.

### Export Issues

**Problem**: Excel export fails
- **Solution**: Ensure you have results to export. Check browser console for detailed error messages.

## Performance Considerations

- **File Size Limit**: 50MB per file
- **Recommended Row Count**: Up to 10,000 rows per file for optimal performance
- **Processing Time**: Typically 1-5 seconds for files with 1,000-5,000 rows
- **Browser Compatibility**: Works best in modern browsers (Chrome, Firefox, Edge, Safari)

## Privacy & Security

- **No Data Transmission**: All processing happens locally in your browser
- **No Backend Server**: No data is sent to any server
- **Local Storage**: Column mapping templates are stored locally in your browser using IndexedDB
- **No Tracking**: No analytics or tracking scripts included

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Technical Details

### Tech Stack
- React 18+ with TypeScript
- Chakra UI for components
- Framer Motion for animations
- Vite for building
- SheetJS (xlsx) for Excel processing
- pdfjs-dist for PDF processing
- fuzzball for fuzzy string matching
- date-fns for date parsing
- IndexedDB (via idb) for local storage

### Build Output
- All files bundled into `dist` folder
- No external CDN dependencies (except PDF.js worker)
- Can be deployed to any static hosting service

### PWA Icons
For full PWA functionality, create icon files:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

These can be created using any image editor or online icon generator. The app will work without them, but PWA installation may not show custom icons.

## FAQ

**Q: Can I use this offline?**  
A: Yes, once loaded, the app works offline. Install as PWA for best offline experience.

**Q: Is my data secure?**  
A: Yes, all processing happens in your browser. No data leaves your computer.

**Q: Can I process multiple files at once?**  
A: The tool processes one test at a time. You can run multiple tests sequentially.

**Q: What if names don't match exactly?**  
A: The tool uses fuzzy matching with an 85% similarity threshold. You can review match confidence scores in results.

**Q: Can I customize the matching threshold?**  
A: Currently fixed at 85%. This can be adjusted in the code if needed for your use case.

**Q: How do I save my column mappings?**  
A: Enter a template name in the "Save Mapping Template" field and click Save. Load it later from the dropdown.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Ensure all required files are uploaded and columns are mapped correctly

## License

This tool is provided as-is for internal use. All processing happens locally - no external dependencies or services required.

## Version History

- **v1.0.0**: Initial release with provision and deprovision testing capabilities

