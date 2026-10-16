import { AppShell } from './components/layout/AppShell'
import { ResumeProvider } from './context/ResumeContext'
import { ResumeBankProvider } from './context/ResumeBankContext'
import { useSyncPhotoForExport } from './hooks/useSyncPhotoForExport'
import { SavedResumeViewer } from './components/preview/SavedResumeViewer'

function AppContent() {
  useSyncPhotoForExport()
  return <AppShell />
}

function App() {
  if (new URLSearchParams(window.location.search).get('view') === '1') return <SavedResumeViewer />
  return (
    <ResumeProvider>
      <ResumeBankProvider><AppContent /></ResumeBankProvider>
    </ResumeProvider>
  )
}

export default App
