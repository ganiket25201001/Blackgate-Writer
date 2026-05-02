# Blackgate Writer - Professional Document Editing Application

A clean, powerful, and beautiful **Word alternative** built with **Rust** + **Tauri** + **React** + **TypeScript** + **Tailwind CSS** + **Tiptap**. Designed by Blackgate IT Solution for professional document creation and editing.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

## 🌟 Features

✨ **Rich Text Editing** - Bold, Italic, Underline, Colors, Highlighting, Multiple fonts and sizes

📝 **Document Formatting** - Alignment, Lists, Spacing, Indentation, Page margins, Line numbers

🖼️ **Media & Objects** - Insert images, Create/edit tables, Hyperlinks, Text boxes, Page breaks

📋 **Navigation & Organization** - Pages panel, Outline view, Jump navigation, Page/word count

💾 **Smart File Management** - New, Open, Save, Auto-Save (30s), Recent files, Templates

⚙️ **Settings & Preferences** - Theme toggle, Auto-save interval, Default font, Language selection

🎨 **Professional UI** - Dark theme, Customizable ribbon, Contextual sidebar, Status bar, Responsive layout

⚡ **Performance** - Tauri native app, Fast startup, Minimal memory, Smooth editing, Large doc support

## 📚 Documentation

**New users?** Start here:
- [RELEASE_NOTES.md](RELEASE_NOTES.md) - v0.1.0 release highlights
- [FEATURES.md](FEATURES.md) - Complete 100+ feature list
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Developer environment setup

**Building or testing?**
- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Build for Windows/macOS/Linux
- [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - 140+ comprehensive tests
- [CHANGELOG.md](CHANGELOG.md) - Version history and roadmap

**Quick reference:**
- This README - Overview and quick start
- [README.md](README.md) - This file

## 📋 Requirements

- **Windows 10+** | **macOS 10.15+** | **Linux** with glibc 2.29+
- **Node.js** 16+ LTS and **Rust** 1.60+
- **512 MB RAM** minimum, **2 GB recommended**

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/blackgateit/writer.git
cd "BLACKGATE Writer"

# Install dependencies
cd frontend && npm install && cd ..
cd src-tauri && cargo build && cd ..

# Run development server
npm run tauri:dev

# Build for production
npm run tauri:build
```

```
frontend/                  # React + TypeScript frontend
├── src/components/        # React components (TitleBar, Ribbon, Editor, etc.)
├── src/contexts/          # Context providers (Document, Ribbon, Editor)
├── src/store/             # Zustand state management
├── src/index.css          # Global styles & theme
└── tailwind.config.js     # Tailwind configuration

src-tauri/                 # Tauri + Rust backend
├── src/main.rs           # Tauri commands for file I/O
├── Cargo.toml            # Rust dependencies
└── tauri.conf.json       # App configuration

assets/                    # Application assets
└── logo.svg              # Blackgate logo

TESTING_CHECKLIST.md      # 140+ test cases for comprehensive testing
README.md                 # This file
```

## 🎮 Keyboard Shortcuts

| Shortcut | Action | Shortcut | Action |
|----------|--------|----------|--------|
| **Ctrl+N** | New Document | **Ctrl+B** | Bold |
| **Ctrl+O** | Open Document | **Ctrl+I** | Italic |
| **Ctrl+S** | Save | **Ctrl+U** | Underline |
| **Ctrl+Shift+S** | Save As | **Tab** | Indent |
| **Ctrl+Z** | Undo | **Shift+Tab** | Decrease Indent |
| **Ctrl+Y** | Redo | **Ctrl+E** | Center Align |
| **Ctrl+A** | Select All | **Ctrl+R** | Right Align |
| **Ctrl+C** | Copy | **Ctrl+L** | Left Align |
| **Ctrl+X** | Cut | **Ctrl+J** | Justify |
| **Ctrl+V** | Paste | - | - |

## 📚 Main Features Implemented

✅ Rich text editor with Tiptap v2  
✅ Professional dark theme (Blackgate branding)  
✅ File operations (New, Open, Save, Save As)  
✅ Formatting ribbon with Home & Insert tabs  
✅ Right sidebar with contextual controls  
✅ Left sidebar with Pages and Outline navigation  
✅ Image insertion with base64 encoding  
✅ Table creation and editing  
✅ Document formatting (fonts, colors, alignment, lists)  
✅ Keyboard shortcuts  
✅ Status bar (page count, word count, zoom)  
✅ Tauri integration for file I/O  
✅ Responsive window layout  

## 🧪 Testing

Comprehensive testing checklist available in [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md):

- **140+ test cases** covering all features
- File operations, formatting, keyboard shortcuts
- Insert features, UI responsiveness, performance
- Cross-platform compatibility (Windows, macOS, Linux)
- Accessibility and error handling

**Quick Test**:
1. Start dev: `npm run tauri:dev`
2. Create new document → type → apply formatting
3. Insert image/table → verify displays
4. Save file → reopen → verify data persists

## 🛠️ Development

### Frontend Stack
- **React 18** with TypeScript
- **Vite** build tool
- **Tailwind CSS** for styling
- **Tiptap v2** for rich text editing
- **Zustand** for global state
- **@tauri-apps/api** for native integration

### Backend Stack
- **Tauri** for desktop app framework
- **Rust** for file I/O operations
- Base64 encoding for binary files

### Adding Features

1. **Create React component** in `frontend/src/components/`
2. **Add Tauri command** (if needed) in `src-tauri/src/main.rs`
3. **Invoke from frontend** using `await invoke('command_name', {})`

## 📦 Building for Distribution

```bash
# Build for all platforms
npm run tauri:build

# Windows: src-tauri/target/release/bundle/msi/
# macOS:   src-tauri/target/release/bundle/dmg/
# Linux:   src-tauri/target/release/bundle/appimage/
```

## 🔧 Configuration

**App settings** in `src-tauri/tauri.conf.json`:
- Window size and minimum dimensions
- Build targets (exe, msi, dmg, appimage)
- Permission allowlist
- Bundle metadata

**Theme customization** in `frontend/src/index.css`:
- Color variables (--bg, --panel, --accent, --text-primary)
- Typography and spacing
- Dark mode styles

## 🐛 Known Issues & TODO

- [ ] PDF/DOCX export functions (placeholder)
- [ ] Header/Footer implementation (placeholder)
- [ ] Advanced table properties (resize handles, cell styling)
- [ ] Symbol picker modal
- [ ] Page thumbnail visual rendering enhancement
- [ ] Accessibility improvements (ARIA labels, keyboard nav)
- [ ] Cloud sync (OneDrive, Google Drive)
- [ ] Collaboration features

## 📞 Support

- **Issues**: https://github.com/blackgateit/writer/issues
- **Email**: support@blackgate.it
- **Website**: https://www.blackgate.it

## 📄 License

MIT License - See LICENSE file for details

## 👥 Credits

Built by **Blackgate IT Solution** with ❤️ using Rust, Tauri, React, and TypeScript

---

**Version**: 0.1.0  
**Last Updated**: May 2, 2026  
**Status**: Actively Developed ✅
