import { useState } from 'react'

import classNames from 'classnames'

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
        {tags.map((tag) => (
          <label key={tag.tag_id}>
            <input
              type="checkbox"
              className="appearance-none"
              value={tag.tag_id}
              onClick={() =>
                setSelectedTags((prev) => ({
                  ...prev,
                  [tag.tag_id]: !prev[tag.tag_id]
                }))
              }
              {...register('selectedTags')}
            />
            <span
              className={classNames(
                selectedTags[tag.tag_id]
                  ? 'ring-offset-2 ring-2 ring-teal-400'
                  : 'opacity-50',
                'appearance-none inline-block items-center px-2 py-0.5 rounded text-sm font-medium text-slate-800 mr-4 cursor-pointer'
              )}
              style={{ backgroundColor: tag.color_code }}
            >
              {tag.name}
            </span>
          </label>
        ))}
      </div>
      {/* Input - END */}
    </fieldset>
  )
}
