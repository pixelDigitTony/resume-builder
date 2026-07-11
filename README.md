# Resume Builder

A modern, recruiter-focused resume builder built with React and TypeScript. It provides a structured editing workflow, live A4 preview, recruiter-readiness feedback, job-posting keyword analysis, and two PDF export formats.

## Features

- Structured editors for personal information, links, summary, highlights, experience, projects, skills, languages, and education
- Live paginated A4 resume preview
- Recruiter-readiness score with actionable content recommendations
- Job-description keyword comparison for tailored resume variations
- Designed two-column PDF export
- Selectable-text, single-column ATS PDF export
- Importable app-generated PDFs with versioned embedded resume data
- Saved resume variations for different roles or companies
- Automatic local persistence and schema migrations
- Profile-photo upload, crop, repositioning, and keyboard controls
- Responsive, accessible Edit and Preview workspaces
- Bullet-aware pagination for long experience and project sections

## ATS PDF vs. Designed PDF

The **ATS PDF** uses a conventional single-column reading order and selectable text for applicant tracking systems and online applications.

The **designed PDF** preserves the two-column visual resume, colors, profile photo, and presentation-oriented layout for direct sharing with recruiters.

Both export formats contain an app-specific data payload. An unchanged PDF exported by this app can be imported later to restore its editable resume fields. PDFs created by older versions, modified by another PDF application, or generated elsewhere may not contain recoverable data.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- jsPDF
- html2canvas
- Lucide React

## Getting Started

### Requirements

- Node.js 20 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173` or `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

## Usage

1. Complete the resume sections in the editor.
2. Open **Review** to check recruiter fundamentals and content quality.
3. Save a variation and paste a job posting to compare recurring keywords.
4. Use **Preview** to inspect page breaks and layout.
5. Choose **ATS PDF** for online applications or **Export PDF** for the designed version.
6. Use **Import PDF** to restore a PDF previously exported by this version of the app.

## Data and Privacy

Resume data is stored in the browser's local storage. The application does not require a backend service to edit or export a resume.

The included default resume and profile photo are sample content for development. Replace them before deploying or sharing a public instance if they contain personal information.

## Project Structure

```text
src/
  components/
    editor/       Resume editing and review interfaces
    export/       Designed and ATS PDF exports
    import/       PDF data restoration
    layout/       Application shell and responsive workspace
    preview/      A4 resume rendering and measurement
  context/        Resume state and persistence actions
  data/           Default resume content
  hooks/          Preview scaling, pagination, and storage hooks
  types/          Resume and page-layout models
  utils/          Analysis, migrations, PDF, photo, and pagination logic
```

## Notes

- Recruiter and keyword scores are guidance, not hiring predictions.
- Add metrics only when they are accurate and defensible.
- Skill ratings are intentionally omitted because evidence from experience and projects is usually more useful than self-assigned proficiency scores.
