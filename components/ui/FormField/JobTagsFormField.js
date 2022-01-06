import { JobTagsCheckboxes } from '@components/ui/Checkboxes'

export function JobTagsFormField({ tags, register }) {

  return (
    <fieldset>
      <legend className="sr-only">Tags</legend>
      <label className="block font-medium text-slate-700">Tags</label>
      {/* Input - START */}
      <div className="mt-2">
        <JobTagsCheckboxes tags={tags} register={register} />
      </div>
      {/* Input - END */}
    </fieldset>
  )
}
