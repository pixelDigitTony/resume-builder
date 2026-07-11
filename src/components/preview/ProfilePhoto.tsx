import { DEFAULT_PHOTO_URL } from '../../data/defaultResume'

interface ProfilePhotoProps {
  photoUrl: string
  fullName: string
}

export function ProfilePhoto({ photoUrl, fullName }: ProfilePhotoProps) {
  return (
    <div className="resume-photo-wrap" data-sidebar-block="photo" data-sidebar-block-type="photo">
      <div className="resume-photo-frame">
        <img
          src={photoUrl}
          alt={fullName ? `${fullName} profile` : 'Profile photo'}
          className="resume-photo"
          onError={(event) => {
            if (!event.currentTarget.src.endsWith(DEFAULT_PHOTO_URL)) {
              event.currentTarget.src = DEFAULT_PHOTO_URL
            }
          }}
        />
      </div>
    </div>
  )
}
