# Development Setup Guide - Blackgate Writer

Complete setup instructions for local development environment.

## System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 8 GB minimum (4 GB minimum, 16 GB recommended for smooth dev)
- **Disk**: 5 GB free space (for Node modules, Rust toolchain, and builds)
- **Internet**: Required for package installation

## Step 1: Install Prerequisites

### Windows

1. **Download and install Node.js LTS**:
   - Visit https://nodejs.org/
   - Download LTS version
   - Run installer, accept defaults

2. **Install Rust**:
   - Visit https://rustup.rs/
   - Download `rustup-init.exe`
   - Run installer, accept defaults
   - Close and reopen terminal after installation

3. **Install Visual Studio Build Tools**:
   - Download from https://visualstudio.microsoft.com/downloads/
   - Select "Desktop development with C++"
   - Install (requires ~5 GB disk space)

4. **Verify installation**:
   ```cmd
   node --version
   npm --version
   rustc --version
   cargo --version
   ```

### macOS

1. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

2. **Install Node.js** (using Homebrew):
   ```bash
   brew install node
   ```

3. **Install Rust**:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

4. **Verify installation**:
   ```bash
   node --version
   npm --version
   rustc --version
   cargo --version
   ```

### Linux (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update
sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install development dependencies
sudo apt install build-essential
sudo apt install libgtk-3-dev
sudo apt install libwebkit2gtk-4.0-dev
sudo apt install libssl-dev

# Verify installation
node --version
npm --version
rustc --version
cargo --version
```

## Step 2: Clone Repository

```bash
# Clone using HTTPS (easier)
git clone https://github.com/blackgateit/writer.git
cd "BLACKGATE Writer"

# OR clone using SSH (if SSH key configured)
git clone git@github.com:blackgateit/writer.git
cd "BLACKGATE Writer"
```

## Step 3: Install Dependencies

### Frontend
```bash
cd frontend
npm install
cd ..
```

This installs:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Tiptap editor
- Tauri API
- And all other npm packages

Installation takes 2-5 minutes depending on internet speed.

### Rust Backend
```bash
cd src-tauri
cargo build
cd ..
```

This downloads and compiles:
- Tauri framework
- Rust standard library
- All Cargo dependencies

First build takes 5-10 minutes; subsequent builds are faster (incremental).

## Step 4: IDE Setup (Recommended)

### Visual Studio Code

1. **Install VS Code**: https://code.microsoft.com/
2. **Install Extensions**:
   - "Tauri" by tauri-apps
   - "Rust-analyzer" by Rust-lang
   - "ES7+ React/Redux/React-Native snippets" by dsznajder.es7-react-js-snippets
   - "Prettier" by Esbenp.prettier-vscode
   - "Tailwind CSS IntelliSense" by bradlc.vscode-tailwindcss
3. **Open workspace folder**: File → Open Folder → Select project directory

### WebStorm / IntelliJ IDEA

1. Install from https://www.jetbrains.com/
2. Open project
3. Enable Rust plugin: Settings → Plugins → Search "Rust"
4. Configure Node interpreter: Settings → Languages & Frameworks → Node.js

### Neovim / Vim

1. Install rust-analyzer: https://rust-analyzer.github.io/
2. Install LSP client (coc.nvim, lspconfig, etc.)
3. Install TypeScript support

## Step 5: Start Development

```bash
# From project root
npm run tauri:dev
```

This starts:
- **Vite dev server** on http://localhost:5173
- **Tauri dev window** (native desktop app)
- **Hot reload** when files change

**First run takes 30 seconds** while Tauri initializes; subsequent runs are faster.

## Step 6: Make Your First Change

1. **Open file**: `frontend/src/components/TitleBar.tsx`
2. **Find line**: `<div className="font-semibold">BLACKGATE Writer</div>`
3. **Change to**: `<div className="font-semibold">BLACKGATE Writer - Dev</div>`
4. **Save file** (Ctrl+S)
5. **Check dev window** - text should update instantly

## Project Structure Tour

```
BLACKGATE Writer/
├── frontend/                 # React app (everything you see)
│   ├── src/components/       # React components
│   ├── src/contexts/         # State management
│   ├── src/store/            # Zustand global state
│   ├── src/App.tsx          # Main app component
│   ├── tailwind.config.js   # CSS framework config
│   └── package.json         # Frontend dependencies
│
├── src-tauri/                # Rust backend (file operations)
│   ├── src/main.rs          # Tauri commands
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # App configuration
│
├── README.md                # Project overview
├── BUILD_GUIDE.md           # Build instructions
└── TESTING_CHECKLIST.md     # Test cases
```

## Common Development Tasks

### Add a New Component

1. **Create file**: `frontend/src/components/MyComponent.tsx`
2. **Write component**:
   ```typescript
   import React from 'react'
   export default function MyComponent() {
     return <div>My Component</div>
   }
   ```
3. **Import in parent**: `import MyComponent from './MyComponent'`
4. **Use in JSX**: `<MyComponent />`

### Add a Style

1. **Edit file**: `frontend/src/index.css`
2. **Add CSS rule** (uses Tailwind + regular CSS):
   ```css
   .my-style {
     @apply px-4 py-2 rounded bg-blue-500;
   }
   ```
3. **Use in component**: `<div className="my-style">...</div>`

### Add a Tauri Command

1. **Edit file**: `src-tauri/src/main.rs`
2. **Add function**:
   ```rust
   #[tauri::command]
   fn my_command(param: String) -> String {
     format!("Hello {}", param)
   }
   ```
3. **Register** in `tauri::generate_handler!` macro
4. **Call from frontend**:
   ```typescript
   const { invoke } = await import('@tauri-apps/api/tauri')
   const result = await invoke('my_command', { param: 'world' })
   ```

### Debug the App

**Browser DevTools**:
```typescript
// In your React component
console.log('Debug message', variable)
```

Open: `View → Toggle Developer Tools` in Tauri dev window

**Rust Debugging**:
```rust
println!("Debug: {:?}", variable);
```

Check terminal output for debug prints

## Useful npm Scripts

```bash
# Development
npm run tauri:dev           # Start dev server
npm run tauri:build         # Build production app
npm run tauri:open          # Open tauri config

# Frontend only
cd frontend
npm run dev                 # Start Vite dev server (without Tauri)
npm run build              # Build React app
npm run preview            # Preview production build
npm run lint               # Check code quality

# Rust only
cd src-tauri
cargo build                # Debug build
cargo build --release      # Optimized build
cargo fmt                  # Format code
cargo clippy               # Lint code
```

## Keyboard Shortcuts (Dev Window)

- **F12** / **Ctrl+Shift+I** - Open DevTools
- **Ctrl+R** - Reload app
- **Ctrl+Shift+R** - Hard reload (clear cache)
- **Ctrl+Alt+Delete** - Close app (if frozen)

## Troubleshooting

### "command not found: npm"
- **Cause**: Node.js not installed or not in PATH
- **Fix**: Restart terminal after Node.js installation, or reinstall

### "Can't find tauri-cli"
- **Cause**: Tauri not installed globally
- **Fix**: Install locally: `npm install`

### "error: linker not found"
- **Cause**: C++ build tools not installed (Windows)
- **Fix**: Install Visual Studio Build Tools

### "failed to fetch https://crates.io"
- **Cause**: Network/firewall issue
- **Fix**: Check internet, try with VPN or use mirror registry

### "WebKit not found" (macOS)
- **Cause**: Xcode Command Line Tools not installed
- **Fix**: Run `xcode-select --install`

### App won't start
- **Cause**: Port 5173 already in use
- **Fix**: Kill process: `lsof -ti:5173 | xargs kill -9` (macOS/Linux)

### Slow builds
- **Cause**: First build or many changes
- **Fix**: Subsequent builds are faster; make incremental changes

## Next Steps

1. ✅ Run `npm run tauri:dev`
2. ✅ Explore the code in `frontend/src/`
3. ✅ Make a small change and see hot reload
4. ✅ Read [README.md](README.md) for feature overview
5. ✅ Check [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for test scenarios
6. ✅ Review [BUILD_GUIDE.md](BUILD_GUIDE.md) when ready to ship

## Getting Help

- **Tauri Docs**: https://tauri.app/
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Tailwind CSS Docs**: https://tailwindcss.com/
- **GitHub Issues**: Report bugs or suggest features

---

**Happy coding! 🚀**

Last Updated: May 2, 2026
