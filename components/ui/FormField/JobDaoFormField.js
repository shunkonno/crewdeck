import { useState } from 'react'
import { DaoSelectBox } from '../SelectBox'


export function JobDaoFormField({
  Controller,
  control,
  errors,
  daoSelectorIsReady,
  daoSelectorOptions
}) {
  const [selectedDao, setSelectedDao] = useState(null)
  return (
    <>
      <Controller
        control={control}
        name="selectedDao"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <DaoSelectBox
            onChange={onChange}
            selectedDao={value || null}
            setSelectedDao={setSelectedDao}
            daoSelectorIsReady={daoSelectorIsReady}
            daoSelectorOptions={daoSelectorOptions}
          />
        )}
      />
      <div className="mt-2">
        {errors?.selectedDao?.type === 'required' && (
          <p className="text-red-400 text-sm">Select DAO.</p>
        )}
      </div>
    </>
  )
}
