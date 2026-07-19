# Resume Builder

A modern, recruiter-focused resume builder built with React and TypeScript. It provides a structured editing workflow, live A4 preview, recruiter-readiness feedback, job-posting keyword analysis, and two PDF export formats.

## Features

- Structured editors for personal information, links, summary, highlights, experience, projects, skills, languages, and education
- Live paginated A4 resume preview
- Recruiter-readiness score with actionable content recommendations
- Job-description keyword comparison for tailored resume variations
- Selectable-text, two-column browser PDF export
- Selectable-text, single-column ATS PDF export
- Importable ATS PDFs with optional versioned resume data
- Saved resume variations for different roles or companies
- Automatic local persistence and schema migrations
- Profile-photo upload, crop, repositioning, and keyboard controls
- Responsive, accessible Edit and Preview workspaces
- Bullet-aware pagination for long experience and project sections

## ATS PDF vs. Designed PDF

The **ATS PDF** uses a conventional single-column reading order and selectable text for applicant tracking systems and online applications.

The **designed PDF** uses the browser's native print engine to preserve selectable text, links, colors, profile photo, and the two-column presentation. Choose **Save as PDF** in the print dialog.

The ATS PDF can optionally contain an app-specific data payload. An unchanged ATS PDF exported with editable data can be imported later to restore its resume fields. Browser-printed designed PDFs, PDFs created by older versions, files modified by another PDF application, and PDFs generated elsewhere do not contain recoverable app data.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- jsPDF
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
5. Choose **ATS PDF** for a conventional single-column document or **Print PDF** for the designed version, then select **Save as PDF** in the browser dialog.
6. Use **Import PDF** to restore an ATS PDF that was exported with editable data.

## Data and Privacy

Resume data is stored in the browser's local storage. The application does not require a backend service to edit or export a resume.

New resumes start blank. No candidate profile, employment history, contact details, or profile photo is bundled as default resume content.

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
