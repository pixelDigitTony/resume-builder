import type { ChangeEvent } from 'react'
import { lazy, Suspense, useState } from 'react'
import { DEFAULT_PHOTO_URL } from '../../data/defaultResume'
import { useResume } from '../../context/ResumeContext'
import { DEFAULT_PHOTO_CROP, type PhotoCrop } from '../../types/resume'
import { cropImageToDataUrl } from '../../utils/photoCrop'
import { Field, TextInput } from './Field'
import { FormSection } from './FormSection'
import { secondaryButton, subtleButton } from './buttonStyles'

const PhotoCropModal = lazy(() =>
  import('./PhotoCropModal').then((module) => ({ default: module.PhotoCropModal })),
)

export function PersonalInfoForm() {
  const { resume, updatePersonal } = useResume()
  const { personal } = resume
  const [cropSourceUrl, setCropSourceUrl] = useState<string | null>(null)
  const [cropInitial, setCropInitial] = useState<PhotoCrop>(DEFAULT_PHOTO_CROP)

  const applyPhoto = (photoUrl: string, crop: PhotoCrop, originalUrl: string) => {
    updatePersonal({
      photoUrl,
      photoCrop: crop,
      photoOriginalUrl: originalUrl,
    })
    setCropSourceUrl(null)
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setCropInitial(DEFAULT_PHOTO_CROP)
      setCropSourceUrl(dataUrl)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const openCropEditor = () => {
    setCropInitial(personal.photoCrop ?? DEFAULT_PHOTO_CROP)
    setCropSourceUrl(personal.photoOriginalUrl || personal.photoUrl)
  }

  const resetPhoto = async () => {
    try {
      const photoUrl = await cropImageToDataUrl(DEFAULT_PHOTO_URL, DEFAULT_PHOTO_CROP)
      updatePersonal({
        photoUrl,
        photoOriginalUrl: DEFAULT_PHOTO_URL,
        photoCrop: DEFAULT_PHOTO_CROP,
      })
    } catch {
      updatePersonal({
        photoUrl: DEFAULT_PHOTO_URL,
        photoOriginalUrl: DEFAULT_PHOTO_URL,
        photoCrop: DEFAULT_PHOTO_CROP,
      })
    }
  }

  return (
    <>
      <FormSection title="Personal info" eyebrow="Identity">
        <div className="space-y-4">
          <Field label="Profile photo">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img
                src={personal.photoUrl}
                alt="Profile preview"
                className="h-20 w-20 rounded-full border-4 border-teal-50 object-cover shadow-sm"
              />
              <div className="flex flex-wrap gap-2">
                <label className={`${secondaryButton} cursor-pointer`}>
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={openCropEditor}
                  className={secondaryButton}
                >
                  Adjust crop
                </button>
                <button
                  type="button"
                  onClick={() => void resetPhoto()}
                  className={subtleButton}
                >
                  Reset photo
                </button>
              </div>
            </div>
          </Field>

          <Field label="Full name">
            <TextInput
              value={personal.fullName}
              onChange={(event) => updatePersonal({ fullName: event.target.value })}
            />
          </Field>

          <Field label="Professional title">
            <TextInput
              value={personal.title}
              onChange={(event) => updatePersonal({ title: event.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <TextInput
                type="tel"
                value={personal.phone}
                onChange={(event) => updatePersonal({ phone: event.target.value })}
              />
            </Field>
            <Field label="Email">
              <TextInput
                type="email"
                value={personal.email}
                onChange={(event) => updatePersonal({ email: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Location">
            <TextInput
              value={personal.location}
              onChange={(event) => updatePersonal({ location: event.target.value })}
            />
          </Field>
        </div>
      </FormSection>

      {cropSourceUrl && (
        <Suspense fallback={null}>
          <PhotoCropModal
            sourceUrl={cropSourceUrl}
            initialCrop={cropInitial}
            onApply={applyPhoto}
            onClose={() => setCropSourceUrl(null)}
          />
        </Suspense>
      )}
    </>
  )
}
