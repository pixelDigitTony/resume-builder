import { AppShell } from './components/layout/AppShell'
import { ResumeProvider } from './context/ResumeContext'
import { useSyncPhotoForExport } from './hooks/useSyncPhotoForExport'

function AppContent() {
  useSyncPhotoForExport()
  return <AppShell />
}

function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  )
}

export default App
