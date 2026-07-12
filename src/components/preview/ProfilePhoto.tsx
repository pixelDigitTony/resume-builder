interface ProfilePhotoProps {
  photoUrl: string
  fullName: string
}

export function ProfilePhoto({ photoUrl, fullName }: ProfilePhotoProps) {
  if (!photoUrl) return null

  return (
    <div className="resume-photo-wrap" data-sidebar-block="photo" data-sidebar-block-type="photo">
      <div className="resume-photo-frame">
        <img
          src={photoUrl}
          alt={fullName ? `${fullName} profile` : 'Profile photo'}
          className="resume-photo"
          onError={(event) => event.currentTarget.closest('.resume-photo-wrap')?.remove()}
        />
      </div>
    </div>
  )
}
