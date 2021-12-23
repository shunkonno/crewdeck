
import classNames from "classnames"

export function JobTagsFormField ({ tags, selectedTags, setSelectedTags}) {
  return(
    <fieldset>
      <legend className="sr-only">Tags</legend>
      <label className="block font-medium text-slate-700">Tags</label>
      {tags.map((tag) => (
        <span
          key={tag.tag_id}
          className={classNames(
            selectedTags[tag.tag_id]
              ? 'ring-offset-2 ring-2 ring-teal-400'
              : 'opacity-50',
            'inline-block mt-4 items-center px-2 py-0.5 rounded text-sm font-medium text-slate-800 mr-4 cursor-pointer'
          )}
          style={{ backgroundColor: tag.color_code }}
          onClick={() =>
            setSelectedTags((prev) => ({
              ...prev,
              [tag.tag_id]: !prev[tag.tag_id]
            }))
          }
        >
          {tag.name}
        </span>
      ))}
    </fieldset>
  )
}