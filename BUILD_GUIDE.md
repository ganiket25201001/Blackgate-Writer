# Build Guide - Blackgate Writer v0.1.0

Complete cross-platform build instructions for Windows, macOS, and Linux.

## Prerequisites

### All Platforms
- **Node.js** 16+ LTS: [Download](https://nodejs.org/)
- **Rust** 1.60+: [Install](https://rustup.rs/)
- **Git**: [Download](https://git-scm.com/)

### Windows
- **Visual C++ Build Tools** or **Microsoft Visual Studio**
- **Windows SDK** 10.0 or later

### macOS
- **Xcode Command Line Tools**: `xcode-select --install`
- **Apple Silicon (M1/M2)** for native ARM64 builds

### Linux
- **GCC** or **Clang**: `sudo apt-get install build-essential` (Ubuntu/Debian)
- **GTK 3** development files: `sudo apt-get install libgtk-3-dev` (Ubuntu/Debian)
- **WebKit2GTK** development files: `sudo apt-get install libwebkit2gtk-4.0-dev` (Ubuntu/Debian)
- **libssl** development files: `sudo apt-get install libssl-dev` (Ubuntu/Debian)

## Setup

### 1. Clone Repository
```bash
git clone https://github.com/blackgateit/writer.git
cd "BLACKGATE Writer"
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Install Rust Dependencies
```bash
cd src-tauri
cargo build
cd ..
```

(First build will take 5-10 minutes as it compiles Tauri and dependencies)

## Development Build

### Run Dev Server
```bash
npm run tauri:dev
```

This starts:
- Vite dev server on http://localhost:5173
- Tauri dev window with hot reload
- Rust backend auto-compilation

**Ctrl+C** to stop development server

## Production Build

### Build for Current Platform
```bash
npm run tauri:build
```

Output location depends on platform:
- **Windows**: `src-tauri/target/release/bundle/msi/`
- **macOS**: `src-tauri/target/release/bundle/dmg/`
- **Linux**: `src-tauri/target/release/bundle/appimage/`

### Build for Windows

From Windows Command Prompt or PowerShell:

```batch
npm run tauri:build
```

**Output**: `src-tauri/target/release/bundle/msi/Blackgate.Writer_0.1.0_x64_en-US.msi`

**Install**: Double-click the .msi file to run installer

**Uninstall**: Control Panel → Programs → Programs and Features → Blackgate Writer → Uninstall

### Build for macOS

From macOS Terminal:

```bash
npm run tauri:build
```

**Output**: `src-tauri/target/release/bundle/dmg/Blackgate.Writer_0.1.0_x64.dmg`

**Install**: 
1. Double-click `Blackgate.Writer_0.1.0_x64.dmg`
2. Drag app to `/Applications` folder
3. Eject disk image

**For Apple Silicon (M1/M2)**, the build should auto-detect and create ARM64 version:
- Universal binary: `Blackgate.Writer_0.1.0_universal.dmg` (contains x86_64 + ARM64)

**Gatekeeper & Notarization** (for distribution):
```bash
# Codesign the app
codesign -s - --deep --force src-tauri/target/release/Blackgate\ Writer.app

# Or submit to Apple for notarization (requires Apple Developer account)
xcrun altool --notarize-app --file dmg-file --primary-bundle-id com.blackgate.writer
```

### Build for Linux

From Linux Terminal:

```bash
npm run tauri:build
```

**Output**: `src-tauri/target/release/bundle/appimage/blackgate_writer-0.1.0-x86_64.AppImage`

**Make executable**:
```bash
chmod +x blackgate_writer-0.1.0-x86_64.AppImage
```

**Run directly**:
```bash
./blackgate_writer-0.1.0-x86_64.AppImage
```

**Install system-wide** (optional):
```bash
# Copy to /opt
sudo cp blackgate_writer-0.1.0-x86_64.AppImage /opt/blackgate-writer

# Create desktop entry
sudo tee /usr/share/applications/blackgate-writer.desktop > /dev/null << EOF
[Desktop Entry]
Type=Application
Name=Blackgate Writer
Exec=/opt/blackgate-writer
Icon=blackgate-writer
Terminal=false
Categories=Office;WordProcessor;
EOF
```

## Cross-Platform Build

Build for all platforms on a single machine:

### From Windows (requires cross-compilation setup):
```bash
# For other targets, you need cross-compilation toolchains installed
npm run tauri:build
```

### From macOS (requires cross-compilation setup):
```bash
# Build for x86_64 + ARM64
npm run tauri:build
```

### From Linux:
```bash
# Limited cross-compilation support; primarily builds for Linux x86_64
npm run tauri:build
```

**Note**: For true cross-platform building, consider using GitHub Actions (see CI/CD section)

## CI/CD Build via GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        platform: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2
      - run: pnpm install
      - run: npm run tauri:build
      - uses: softprops/action-gh-release@v1
        with:
          files: src-tauri/target/release/bundle/**/*
```

Then push tags to trigger builds:
```bash
git tag v0.1.0
git push origin v0.1.0
```

Builds run on GitHub runners and artifacts uploaded to Releases.

## Troubleshooting

### Windows
- **MSVS build tools error**: Install Visual C++ Build Tools or Visual Studio
- **Linker error**: Ensure Windows SDK is installed
- **Node modules issue**: Delete `node_modules` and `package-lock.json`, then `npm install`

### macOS
- **Code signing issues**: Run `codesign -s - --deep --force src-tauri/target/release/Blackgate\ Writer.app`
- **Gatekeeper blocks app**: Try `sudo xattr -rd com.apple.quarantine /path/to/app`
- **M1 compatibility**: Use Rosetta2 for x86_64 or native ARM64 binary

### Linux
- **GTK/WebKit errors**: Install development packages (see Prerequisites)
- **Library errors**: Run with debug: `LD_DEBUG=libs ./blackgate_writer-*.AppImage`
- **AppImage not executable**: `chmod +x blackgate_writer-*.AppImage`

### All Platforms
- **Tauri compilation error**: `cargo clean && cargo build` (full rebuild)
- **Frontend build error**: `rm -rf frontend/node_modules && npm install`
- **Strange behavior**: Clear Tauri app cache: `~/.tauri/` or `%APPDATA%/Blackgate Writer/`

## Version Updates

To release a new version:

1. **Update version number**:
   ```bash
   # Edit src-tauri/tauri.conf.json
   # Edit frontend/package.json
   # Edit root package.json (if exists)
   ```

2. **Commit and tag**:
   ```bash
   git add -A
   git commit -m "Release v0.2.0"
   git tag v0.2.0
   git push origin main
   git push origin v0.2.0
   ```

3. **Build**:
   ```bash
   npm run tauri:build
   ```

4. **Create GitHub Release**:
   - Go to GitHub repo → Releases → Create Release
   - Upload `.msi`, `.dmg`, and `.AppImage` files
   - Write release notes

## Distribution

### Windows MSI
- Can be installed via Group Policy (enterprise)
- Adds Start Menu shortcuts
- Registers file associations
- Auto-update support (can be added later)

### macOS DMG
- Drag-and-drop installation
- Code signing required for distribution
- Notarization recommended for Gatekeeper approval

### Linux AppImage
- Self-contained, no installation needed
- Works on most Linux distributions
- No dependencies required
- Auto-update support available

## Performance Optimization

### Reduce Bundle Size
```bash
# In src-tauri/Cargo.toml, add:
[profile.release]
opt-level = 3
lto = true
strip = true
```

### Faster Builds
```bash
# In frontend/tailwind.config.js, minimize unused CSS
# In Cargo.toml, use optimized dependencies
# Consider vendoring dependencies
```

## Security

- ✅ Keep Rust and Node dependencies updated
- ✅ Enable security headers in tauri.conf.json
- ✅ Code sign releases (especially for macOS)
- ✅ Use HTTPS for any remote connections
- ✅ Enable DEP/ASLR in production builds

---

**Last Updated**: May 2, 2026  
**Version**: 0.1.0
