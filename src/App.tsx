import { AppShell } from './components/layout/AppShell'
import { ResumeProvider } from './context/ResumeContext'
import { ResumeBankProvider } from './context/ResumeBankContext'
import { useSyncPhotoForExport } from './hooks/useSyncPhotoForExport'

function AppContent() {
  useSyncPhotoForExport()
  return <AppShell />
}

function App() {
  return (
    <ResumeProvider>
      <ResumeBankProvider><AppContent /></ResumeBankProvider>
    </ResumeProvider>
  )
}

export default App
