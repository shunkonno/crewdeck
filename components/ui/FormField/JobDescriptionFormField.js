import dynamic from 'next/dynamic'

// Quill Editor - Dynamic import to prevent SSR --- https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote']
  ]
}

export function JobDescriptionFormField({ Controller, control }) {
  return (
    <>
      <div>
        <legend className="sr-only">Description</legend>
        <label className="block font-medium text-slate-700">Description</label>
        <p className="mt-1 text-sm text-slate-500">
          Describe the job, including some background.
        </p>
      </div>
      {/* Input - START */}
      <div className="mt-2">
        <Controller
          control={control}
          name="editorContent"
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={value || ''}
              onChange={(editorContent) => onChange(editorContent)}
            />
          )}
        />
      </div>
      {/* Input - END */}
    </>
  )
}
