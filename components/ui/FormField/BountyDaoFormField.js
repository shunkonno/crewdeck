import { useState } from 'react'
import { DaoSelectBox } from '../SelectBox'

export function BountyDaoFormField({
  Controller,
  control,
  errors,
  daoSelectorIsReady,
  daoSelectorOptions
}) {
  const [selectedDao, setSelectedDao] = useState(null)
  return (
    <>
      <label className="block font-medium text-slate-700">DAO</label>
      <p className="mt-1 text-sm text-slate-500">
        Select the DAO you own a token for.
        <br />
        Not in the list?{' '}
        <span>
          <a
            target="_blank"
            className="text-blue-500"
            href="https://docs.google.com/forms/d/1J_xx0eTRmsSwzsXFUVUwilhtOYqJfBJhqQH_5Wt9NH0/"
            rel="noreferrer"
          >
            Apply here.
          </a>
        </span>
      </p>
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
