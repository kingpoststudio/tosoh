# Tosoh Functions Build Pipeline

This directory contains HubSpot serverless functions with a TypeScript build pipeline.

## Structure

```
functions/
├── src/                    # Source files
│   └── app/
│       ├── app.json
│       └── app.functions/
│           ├── *.ts        # TypeScript source files
│           ├── *.js        # JavaScript files (pre-existing)
│           ├── *.json      # Configuration files
│           └── package.json
├── dist/                   # Compiled output (generated)
│   ├── app/
│   │   ├── app.json
│   │   └── app.functions/
│   │       ├── *.js        # Compiled JavaScript files
│   │       └── *.json      # Configuration files
│   ├── hsproject.json      # HubSpot project config
│   └── hubspot.config.yml  # HubSpot authentication
├── tsconfig.json          # TypeScript configuration
├── hubspot.config.yml     # HubSpot authentication (source)
├── hsproject.json         # HubSpot project config (source)
└── package.json           # Build scripts
```

## Build Commands

### Install dependencies
```bash
npm install
```

### Build the project
```bash
npm run build
```
This will:
1. Clean the `dist/` directory
2. Compile all TypeScript files from `src/` to `dist/`
3. Copy all `.json`, `.js`, and `.lock` files (excluding `node_modules`)
4. Copy and configure HubSpot config files for deployment

### Watch mode (for development)
```bash
npm run watch
```
Automatically recompiles TypeScript files on changes (does not copy other files).

### Clean the dist directory
```bash
npm run clean
```

## Deployment

### Deploy to HubSpot (Build + Upload)
```bash
npm run deploy
```
This single command will build and upload your functions in one step.

### Manual deployment (separate steps)
```bash
# Build the project
npm run build

# Upload to HubSpot
npm run upload
```

The `upload` command will:
1. Navigate to the `dist/` directory
2. Run `hs project upload` to deploy your compiled functions

## How it works

- **TypeScript compilation**: The TypeScript compiler (`tsc`) reads `tsconfig.json` and compiles all `.ts` files from `src/` to `dist/` while maintaining the directory structure.
- **File copying**: Build scripts use `rsync` to copy non-TypeScript files (JSON configs, existing JS files, lock files) while excluding `node_modules` for a clean build.
- **Config management**: HubSpot configuration files are automatically copied and adjusted for the `dist/` directory structure.
- **Output**: The `dist/` directory contains only the compiled and necessary files, ready for deployment to HubSpot.

## Notes

- The `dist/` directory does NOT include `node_modules` to keep builds fast and clean
- TypeScript source files (`.ts`) are compiled to JavaScript (`.js`) and only the JavaScript files are uploaded
- The build process maintains the exact directory structure required by HubSpot

