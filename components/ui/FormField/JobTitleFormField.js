import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

export function JobTitleFormField({ errors, register }) {
  const [title, setTitle] = useState('')

  return (
    <>
      <div>
        <legend className="sr-only">Title</legend>
        <label className="block font-medium text-slate-700">Title</label>
        <p className="mt-1 text-sm text-slate-500">Try to make it concise.</p>
      </div>
      {/* Input - START */}
      <div>
        <input
          type="text"
          className="mt-1 py-2 shadow-sm border focus:outline-none focus:border-primary px-2 block w-full rounded-md border-slate-300"
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          {...register('title', {
            required: true,
            maxLength: 200
          })}
        />
      </div>
      {/* Input - END */}
      <div className="mt-2">
        {errors?.title?.type === 'required' && (
          <p className="text-red-400 text-sm">This input is required.</p>
        )}
        {errors?.title?.type === 'maxLength' && (
          <p className="text-red-400 text-sm">Max length is 200 characters.</p>
        )}
      </div>
    </>
  )
}
