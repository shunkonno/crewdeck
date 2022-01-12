import { useState } from 'react'

export function JobTitleTextInput({ register }) {
  const [title, setTitle] = useState('')

  return (
    <>
      <input
        type="text"
        className="mt-1 py-2 shadow-sm border focus:outline-none focus:border-primary px-2 block w-full rounded-lg border-slate-300"
        onChange={(e) => {
          setTitle(e.target.value)
        }}
        {...register('title', {
          required: true,
          maxLength: 200
        })}
      />
    </>
  )
}
