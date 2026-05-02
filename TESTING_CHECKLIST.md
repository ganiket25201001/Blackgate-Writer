# Testing Checklist - Blackgate Writer v0.1.0

## File Operations
- [ ] **New Document** - Create a new blank document, verify file name resets
- [ ] **Open Document** - Open existing .txt or .docx file, verify content loads correctly
- [ ] **Save Document** - Save changes to file, verify it persists on disk
- [ ] **Save As** - Save with new filename, verify both old and new files exist
- [ ] **File Dialog** - Verify open/save dialogs work on all OS (Windows/Mac/Linux)
- [ ] **Unsaved Changes** - Verify "unsaved" indicator appears after edits
- [ ] **Undo/Redo** - Test Ctrl+Z and Ctrl+Y throughout editing
- [ ] **Recently Opened** - Test file history (if implemented)

## Formatting & Editing
- [ ] **Text Style** - Bold, Italic, Underline, Strikethrough (toggle all)
- [ ] **Font Selection** - Change font from dropdown, verify applies
- [ ] **Font Size** - Change size, verify text scales
- [ ] **Text Color** - Apply text color, verify renders correctly
- [ ] **Highlight** - Apply highlight color, verify background color works
- [ ] **Text Alignment** - Left, Center, Right, Justify alignment
- [ ] **Lists** - Bullet list, Numbered list, multilevel nesting
- [ ] **Clear Formatting** - Clear all formatting from selected text
- [ ] **Copy/Paste** - Ctrl+C/Ctrl+V, verify formatting preserved
- [ ] **Cut** - Ctrl+X, verify text removed and clipboard set

## Keyboard Shortcuts
- [ ] **Ctrl+N** - New document
- [ ] **Ctrl+O** - Open dialog
- [ ] **Ctrl+S** - Save current file
- [ ] **Ctrl+Shift+S** - Save As dialog
- [ ] **Ctrl+Z** - Undo
- [ ] **Ctrl+Y** - Redo
- [ ] **Ctrl+A** - Select all
- [ ] **Ctrl+B** - Bold toggle
- [ ] **Ctrl+I** - Italic toggle
- [ ] **Ctrl+U** - Underline toggle
- [ ] **Tab** - Indent/increase paragraph indent
- [ ] **Shift+Tab** - Decrease paragraph indent
- [ ] **Ctrl+Shift+P** - Paragraph settings (if implemented)

## Insert Features
- [ ] **Insert Image** - Insert image from file, verify displays correctly
- [ ] **Image Properties** - Modify image width/alt text via Right Sidebar
- [ ] **Image Resize** - Resize image in editor, verify handles work
- [ ] **Insert Table** - Insert 3x3 table via TablePicker, verify renders
- [ ] **Table Editing** - Add/delete rows and columns via Right Sidebar
- [ ] **Insert Link** - Add hyperlink via Insert tab
- [ ] **Link Navigation** - Ctrl+Click on link (or Right-click → Open)
- [ ] **Insert Page Break** - Add page break, verify creates new page
- [ ] **Insert Text Box** - Add text box, verify independent formatting
- [ ] **Insert Symbol** - Open symbol picker (if implemented)
- [ ] **Header/Footer** - Insert header/footer placeholder (if implemented)

## Ribbon & UI
- [ ] **Home Tab** - Verify all Home ribbon buttons appear and work
- [ ] **Insert Tab** - Verify Insert ribbon buttons appear and work
- [ ] **Tab Switching** - Switch between ribbon tabs smoothly
- [ ] **Ribbon Button State** - Buttons reflect current selection state
- [ ] **Dropdown Menus** - Font, Size, Color dropdowns open/close correctly
- [ ] **File Menu** - File menu appears with New/Open/Save/Save As/Export/Exit

## Right Sidebar
- [ ] **Sidebar Toggle** - Collapse/expand right sidebar
- [ ] **Font Controls** - Font family, size, spacing controls visible
- [ ] **Paragraph Controls** - Line spacing, alignment, indentation
- [ ] **Bullets & Lists** - Bullet list and numbering options
- [ ] **Page Settings** - Page color, margins controls
- [ ] **Context-Sensitive** - Sidebar switches to image/table controls when selected
- [ ] **Image Properties** - Width, Alt text editable when image selected
- [ ] **Table Properties** - Row/Col add/remove buttons when table selected

## Left Sidebar
- [ ] **Sidebar Toggle** - Collapse/expand left sidebar
- [ ] **Pages Tab** - Shows page previews/thumbnails
- [ ] **Outline Tab** - Shows heading hierarchy
- [ ] **Navigation** - Click page/outline item, scroll to correct position
- [ ] **Refresh** - Sidebar updates as document content changes

## Status Bar
- [ ] **Page Count** - Shows correct total pages
- [ ] **Word Count** - Shows reasonable word count estimate
- [ ] **Language** - Shows "EN" or correct language
- [ ] **Zoom Control** - Zoom in/out buttons work
- [ ] **Zoom Level** - Shows current zoom percentage
- [ ] **Zoom Range** - Can zoom from 10% to 200% (or configured range)

## Export & Save
- [ ] **Export to PDF** - Export document to PDF, verify file created
- [ ] **Export to DOCX** - Export document to .docx, verify file created
- [ ] **PDF Quality** - PDF renders text correctly, images preserved
- [ ] **DOCX Compatibility** - DOCX opens in Microsoft Word, formatting intact
- [ ] **Save As .txt** - Save as plain text, verify formatting stripped

## Editor & Content
- [ ] **Large Document** - Load large document (10+ pages), verify no lag
- [ ] **Page Breaks** - Multiple pages display correctly with breaks
- [ ] **Margins** - Document respects page margins
- [ ] **Text Wrapping** - Text wraps correctly within page width
- [ ] **Empty Document** - Start with blank document, can begin typing immediately
- [ ] **Paste Complex Content** - Paste from Word/HTML, formatting preserved
- [ ] **Special Characters** - Type special characters, emojis, international text
- [ ] **Very Long Lines** - Type very long line, verify wraps or scrolls

## Window & Responsiveness
- [ ] **Minimize/Maximize** - Window minimize and maximize work
- [ ] **Resize Window** - Resize window, UI scales responsively
- [ ] **Minimum Size** - Cannot resize below minimum (1000x600)
- [ ] **Full Screen** - Toggle fullscreen (if supported)
- [ ] **Multi-Monitor** - Window moves between monitors, displays correctly
- [ ] **High DPI** - App displays correctly on high-DPI displays (4K, etc.)

## Performance & Stability
- [ ] **Memory Usage** - After editing for 30+ minutes, memory usage stable
- [ ] **No Crashes** - All features work without crashes
- [ ] **Error Handling** - Invalid file operations show error message
- [ ] **Loading States** - Slow operations show loading indicator
- [ ] **Recovery** - Unsaved work recovered after unexpected close
- [ ] **Undo/Redo History** - Can undo/redo hundreds of operations
- [ ] **Large Files** - Can load and edit files >10MB
- [ ] **Many Images** - Document with many images loads without lag

## Dark/Light Mode (if applicable)
- [ ] **Dark Mode** - App displays in dark mode by default
- [ ] **Light Mode** - App can switch to light mode (if implemented)
- [ ] **Contrast** - Text readable in both light and dark modes
- [ ] **UI Elements** - All buttons, inputs, dropdowns visible in both modes
- [ ] **Scrollbars** - Scrollbars visible in both light and dark

## Cross-Platform (if building for multiple OS)
### Windows
- [ ] **Install** - .exe installer completes successfully
- [ ] **Start Menu** - Shortcut created in Start Menu
- [ ] **Launch** - App launches from shortcut
- [ ] **File Association** - Double-click .docx opens in Writer
- [ ] **Uninstall** - App uninstalls cleanly

### macOS
- [ ] **Install** - .dmg mounts, app installs to Applications folder
- [ ] **Launch** - App launches from Spotlight or Applications
- [ ] **Permissions** - Gatekeeper doesn't block (if signed/notarized)
- [ ] **File Dialog** - macOS file dialogs work correctly

### Linux
- [ ] **Install** - AppImage runs directly or installs to system
- [ ] **Launch** - App launches from application menu
- [ ] **Dependencies** - All required libraries bundled or listed
- [ ] **Integration** - File manager integration (if available)

## Accessibility (if prioritized)
- [ ] **Keyboard Navigation** - All UI elements accessible via Tab
- [ ] **Screen Reader** - ARIA labels present for screen readers
- [ ] **High Contrast** - Text readable on high-contrast backgrounds
- [ ] **Font Size** - Can increase UI font size if needed
- [ ] **Tooltips** - Hover tooltips explain button functions

## Build & Deployment
- [ ] **Dev Build** - `npm run tauri dev` starts dev server
- [ ] **Production Build** - `npm run tauri build` compiles successfully
- [ ] **Build Size** - Final executable/bundle is reasonable size
- [ ] **Dependencies** - No missing dependencies on clean install
- [ ] **Version Number** - App displays correct version in About window
- [ ] **Icon** - App icon displays correctly in taskbar/dock

## About Window
- [ ] **Open About** - About window opens from Help menu
- [ ] **Version Display** - Correct version shown
- [ ] **Description** - Feature list and company info displayed
- [ ] **Close Button** - Can close About window
- [ ] **No Crash** - About window doesn't crash app

---

## Test Coverage Summary

| Category | Total | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| File Operations | 8 | - | - | [ ] |
| Formatting & Editing | 10 | - | - | [ ] |
| Keyboard Shortcuts | 12 | - | - | [ ] |
| Insert Features | 10 | - | - | [ ] |
| Ribbon & UI | 6 | - | - | [ ] |
| Right Sidebar | 8 | - | - | [ ] |
| Left Sidebar | 5 | - | - | [ ] |
| Status Bar | 6 | - | - | [ ] |
| Export & Save | 5 | - | - | [ ] |
| Editor & Content | 7 | - | - | [ ] |
| Window & Responsiveness | 6 | - | - | [ ] |
| Performance & Stability | 8 | - | - | [ ] |
| Dark/Light Mode | 5 | - | - | [ ] |
| Cross-Platform | 13 | - | - | [ ] |
| Accessibility | 5 | - | - | [ ] |
| Build & Deployment | 6 | - | - | [ ] |
| About Window | 5 | - | - | [ ] |
| **TOTAL** | **140** | - | - | [ ] |

## Notes & Bug Reports

### Known Issues (to be fixed)
- [ ] Issue #1: [Description]
- [ ] Issue #2: [Description]
- [ ] Issue #3: [Description]

### New Bugs Found During Testing
- [ ] Bug #1: [Description] | Date: _____ | Severity: High/Medium/Low | Status: Open/Fixed
- [ ] Bug #2: [Description] | Date: _____ | Severity: High/Medium/Low | Status: Open/Fixed

### Recommendations & Improvements
- [ ] Improvement #1: [Description]
- [ ] Improvement #2: [Description]

---

**Test Date**: _______________  
**Tester Name**: _______________  
**Test Environment**: Windows / macOS / Linux | v0.1.0  
**Overall Status**: ✅ PASS / ⚠️ PARTIAL PASS / ❌ FAIL
