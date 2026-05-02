# Blackgate Office - Future Roadmap (High-Level)

This roadmap outlines planned features, milestones and release targets for the Blackgate Office suite. It covers the next major releases (v0.2 → v1.0) and long-term goals.

## Vision
Blackgate Office is a modern, extensible productivity suite — starting with Blackgate Writer — that offers fast, privacy-first, and powerful document editing for professionals.

## Release Plan

- v0.1.0 — Core Writer (released)
  - Rich text editing, templates, auto-save, recent files, settings, Tauri packaging

- v0.2.0 — Export & Layout (target)
  - PDF export with fidelity
  - DOCX export/import compatibility
  - Headers/footers, page numbering
  - Styles and template library

- v0.3.0 — Collaboration & Quality
  - Real-time collaboration (optional cloud / self-host)
  - Commenting and review workflow
  - Spelling and grammar (server-assisted optional)

- v1.0 — Productivity Suite
  - Spreadsheet & Presentation apps
  - Plugin architecture
  - Cloud sync and user accounts

## Feature Roadmap (Detailed)

1. Export & Interop
   - PDF: high-fidelity layout engine (embed fonts, CSS print rules)
   - DOCX: use `docx` or server-side conversion tools

2. Document Editing Enhancements
   - Advanced table editor, drawing shapes, charts
   - Stylesheets: paragraph/character styles
   - Accessibility & a11y compliance (WCAG 2.1 AA)

3. Proofing & Language Tools
   - Spellcheck + dictionary + custom dictionaries
   - Grammar checking (integrate open-source models or 3rd-party APIs)
   - Multilingual UI and templates

4. Collaboration
   - Operational Transformation (OT) or CRDT for real-time editing
   - Presence, cursors, comments, suggestions

5. Extensibility
   - Plugin API (frontend + Tauri commands)
   - Marketplace for templates and plugins

6. Distribution & Enterprise
   - MSI/DMG/AppImage installers, auto-updates
   - Enterprise bundling and licensing

## Timeline & Milestones
- 3 months: v0.2 prototype (PDF + DOCX baseline)
- 6 months: v0.3 alpha (spellcheck + basic collaboration)
- 12 months: v1.0 beta (core suite + plugins)

## Technical Notes
- Keep Tauri backend minimal and secure; prefer local operations for privacy.
- Offload heavy conversion (DOCX/PDF) to native bindings or server-side microservices if needed.
- Use WebAssembly (WASM) for CPU-heavy features where appropriate.

## Metrics & Success Criteria
- Startup < 3s on target machines
- Memory < 200MB idle
- Auto-save latency < 200ms
- 90% of user flows covered by tests

## Open Questions
- Offline-first collaboration strategy
- Licensing model for plugins and templates
- Packaging size vs feature trade-offs

---

This roadmap is intentionally high-level. We can expand each item into issues and milestones in the project tracker.
