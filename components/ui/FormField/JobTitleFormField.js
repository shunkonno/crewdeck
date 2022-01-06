import { JobTitleTextInput } from '@components/ui/TextInput'

export function JobTitleFormField({ errors, register }) {
  return (
    <>
      <label className="block font-medium text-slate-700">Title</label>
      <p className="mt-1 text-sm text-slate-500">
        This is the first thing shown. Try to make it concise.
      </p>
      <JobTitleTextInput register={register} />
      <div className="mt-2">
        {errors?.title?.type === 'required' && (
          <p className="text-red-400 text-sm">This input is required.</p>
        )}
        {errors?.title?.type === 'minLength' && (
          <p className="text-red-400 text-sm">最小10文字</p>
        )}
        {errors?.title?.type === 'maxLength' && (
          <p className="text-red-400 text-sm">最大80文字</p>
        )}
      </div>
    </>
  )
}
