import { useEffect, useRef } from 'react'
import { useResume } from '../context/ResumeContext'
import { cropImageToDataUrl } from '../utils/photoCrop'

export function useSyncPhotoForExport() {
  const { resume, updatePersonal } = useResume()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (syncedRef.current) return

    const { photoUrl, photoOriginalUrl, photoCrop } = resume.personal
    if (!photoUrl || photoUrl.startsWith('data:')) {
      syncedRef.current = true
      return
    }

    let cancelled = false

    cropImageToDataUrl(photoOriginalUrl || photoUrl, photoCrop)
      .then((croppedUrl) => {
        if (cancelled) return
        syncedRef.current = true
        if (croppedUrl !== photoUrl) {
          updatePersonal({ photoUrl: croppedUrl })
        }
      })
      .catch(() => {
        syncedRef.current = true
      })

    return () => {
      cancelled = true
    }
  }, [resume.personal, updatePersonal])
}
