import { useState } from 'react'

const publicSettings = [
  {
    id: 'public',
    bool: true,
    name: 'Public',
    description: 'Your post will show up on search results.'
  },
  {
    id: 'private',
    bool: false,
    name: 'Private',
    description:
      'Access only if the person knows the URL. Your post will not show up on search results.'
  }
]

export function PublicSettingsRadioGroup({ register }) {
  const [isPublic, setIsPublic] = useState(true)

  return (
    <>
      {publicSettings.map((publicSetting) => (
        <div key={publicSetting.id} className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id={publicSetting.id}
              aria-describedby={`${publicSetting.id}-description`}
              name="isPublic"
              type="radio"
              defaultChecked={publicSetting.id === 'public'}
              value={publicSetting.id === 'public'}
              className="h-4 w-4 text-primary border-slate-300"
              onClick={(e) => {
                setIsPublic(publicSetting.id === 'public')
              }}
              {...register('isPublic')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={publicSetting.id}
              className="font-medium text-slate-700"
            >
              {publicSetting.name}
            </label>
            <p
              id={`${publicSetting.id}-description`}
              className="text-slate-500"
            >
              {publicSetting.description}
            </p>
          </div>
        </div>
      ))}
    </>
  )
}
