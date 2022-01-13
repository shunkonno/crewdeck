import { useEffect } from "react"
import TextareaAutosize from 'react-textarea-autosize'

export const JobTitleTextArea = ({onChange, title, setTitle, control, name}) => {

  useEffect(() => {
    setTitle(title)
  },[title])

  return(
    <>
      <TextareaAutosize
        className="text-lg sm:text-2xl font-medium border-b border-slate-200 w-full outline-none focus:border-teal-400 resize-none" 
        name={name}
        onChange={(e)=> {
          setTitle(e.target.value.replace(/\n/g, ''))
          onChange && onChange(e)
        }
        }
        value={title}
      />
    </>
  )
}