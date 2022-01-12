import { useState } from 'react'
import { JobTagsCheckboxes } from '@components/ui/Checkboxes'

export function JobTagsFormField({ tags, register }) {

  // tagsの数だけtag_idをキーの持つ、value falseのオブジェクトを作る
  const tagsStateObject = tags.reduce((accum, tag) => {
    return { ...accum, [tag.tag_id]: false }
  }, {})

  const [selectedTags, setSelectedTags] = useState(tagsStateObject)

  return (
    <fieldset>
      <legend className="sr-only">Tags</legend>
      <label className="block font-medium text-slate-700">Tags</label>
      {/* Input - START */}
      <div className="mt-2">
        <JobTagsCheckboxes tags={tags} register={register} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      </div>
      {/* Input - END */}
    </fieldset>
  )
}
