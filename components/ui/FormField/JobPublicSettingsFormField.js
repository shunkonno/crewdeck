import { PublicSettingsRadioGroup } from '@components/ui/RadioGroup'

export function JobPublicSettingsFormField({ register }) {
  return (
    <fieldset>
      <div>
        <legend className="sr-only">Public Settings</legend>
        <label className="block font-medium text-slate-700">
          Public Settings
        </label>
      </div>
      {/* Input - START */}
      <div className="mt-xs space-y-5">
        <PublicSettingsRadioGroup register={register} />
      </div>
      {/* Input - END */}
    </fieldset>
  )
}
