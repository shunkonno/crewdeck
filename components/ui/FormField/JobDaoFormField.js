import { DaoSelectBox } from "../SelectBox"

export function JobDaoFormField ({Controller, control , errors, isReadyDaoOptions, daoSelectorOptions }) {
  return(
    <>
      <Controller
        control={control}
        name="selectedDao"
        rules={ { required: true } }
        render={({ 
          field: { onChange, value } 
        }) => (
          <DaoSelectBox 
            onChange={onChange}
            selectedDao={value}
            isReadyDaoOptions={isReadyDaoOptions}
            daoSelectorOptions={daoSelectorOptions}
          />
        )}
      />
      <div className="mt-2">
        {errors?.selectedDao?.type === 'required' &&  <p className="text-red-400 text-sm">Select DAO.</p>}
      </div>
    </>
  )
}