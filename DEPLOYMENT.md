# IT Auditor Assistant - Deployment Guide

## Build Status
✅ **Build Successful** - All components compiled and bundled successfully.

## Quick Start

### Development
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```
The built files will be in the `dist` folder, ready for deployment.

### Preview Production Build
```bash
npm run preview
```

## Deployment Options

### Option 1: Static File Server
1. Copy the entire `dist` folder to your web server
2. Configure your server to serve `index.html` for all routes
3. Ensure the server supports:
   - Static file serving
   - HTTPS (recommended for PWA)
   - Proper MIME types for `.js`, `.css`, `.json`, etc.

### Option 2: Local Network Deployment
1. Build the application: `npm run build`
2. Use a simple HTTP server:
   ```bash
   # Using Python
   cd dist
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server dist -p 8000
   ```
3. Access at `http://localhost:8000` or `http://[your-ip]:8000`

### Option 3: Company Intranet
1. Build the application: `npm run build`
2. Copy `dist` folder to company web server
3. Configure virtual host or subdirectory
4. Ensure all employees have network access

## File Structure
```
dist/
├── index.html              # Main HTML file
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker
├── registerSW.js          # Service worker registration
├── assets/
│   ├── index-*.css         # Styles
│   ├── index-*.js          # Main application bundle
│   ├── ui-*.js             # UI components bundle
│   ├── pdf-*.js            # PDF processing bundle
│   └── xlsx-*.js           # Excel processing bundle
```

## PWA Features
- ✅ Offline support (service worker)
- ✅ Installable as standalone app
- ✅ Manifest configured
- ⚠️ Icons need to be added (see README.md)

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Important Notes

1. **No Backend Required**: All processing happens client-side
2. **File Size Limit**: 50MB per file
3. **Privacy**: No data leaves the user's browser
4. **Icons**: Add `icon-192.png` and `icon-512.png` to `public/` folder before building for full PWA support

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (recommended: 16+)

### Runtime Errors
- Check browser console for errors
- Ensure browser supports ES2022 features
- Clear browser cache if issues persist

### File Upload Issues
- Verify file format (.xlsx, .xls, .csv, .pdf)
- Check file size (max 50MB)
- Ensure file is not corrupted

## Support
Refer to README.md for detailed usage instructions and troubleshooting.


