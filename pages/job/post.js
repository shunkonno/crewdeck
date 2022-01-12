import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Supabase
import { supabase } from '@libs/supabase'

// Functions
import classNames from 'classnames'
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { verifyAddressOwnership } from '@utils/verifyAddressOwnership'
import { AccountProvider } from '@libs/accountProvider'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import {
  JobTitleFormField,
  JobDescriptionFormField,
  JobDaoFormField,
  JobTagsFormField,
  JobPublicSettingsFormField
} from '@components/ui/FormField'

import { useForm, Controller } from 'react-hook-form'

export default function PostJob({ daos, tags }) {
  // ****************************************
  // ACCOUNT
  // ****************************************

  const accountProvider = AccountProvider()
  const { currentAccount, ethersProvider } = accountProvider
  const router = useRouter()

  // ****************************************
  // REACT-HOOK-FORM
  // ****************************************

  // React Hook Form Setting
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  Object.keys(errors).length && console.log('react-hook-form Errors', errors)

  // ****************************************
  // UI CONTROL STATE
  // ****************************************

  // Dao Options UI Control State
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [daoSelectorIsReady, setDaoSelectorIsReady] = useState(false)

  useEffect(() => {
    if (currentAccount) {
      detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions).then(() => {
        setDaoSelectorIsReady(true)
      })
    }
  }, [currentAccount, daos])

  // ****************************************
  // DB
  // ****************************************

  // Saves search object to Algolia.
  async function saveToAlgolia(algoliaObject) {
    const response = await fetch('/api/algolia/saveJobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(algoliaObject)
    })

    return response
  }

  // Saves job.
  async function saveJob(title, selectedDao, editorContent, isPublic) {
    const { data: result, saveJobError } = await supabase.from('jobs').insert([
      {
        title: title,
        description: editorContent,
        dao_id: selectedDao.dao_id,
        is_public: isPublic
      }
    ])

    if (saveJobError) {
      console.log(error)
      return false
    }

    // Return saved object.
    return result
  }

  // Saves tags.
  async function saveTags(jobId, tagIds) {
    const insertObjectList = []

    tagIds.length &&
      tagIds.map((tagId) => {
        insertObjectList.push({ job_id: jobId, tag_id: tagId })
      })

    const { data: result, saveTagsError } = await supabase
      .from('jobs_to_tags')
      .insert(insertObjectList)

    if (saveTagsError) {
      console.log(saveTagsError)
      return false
    }

    // Return saved object.
    return result
  }

  // Saves data to DB.
  async function saveToDB(
    title,
    selectedDao,
    editorContent,
    selectedTags,
    isPublic
  ) {
    // Save job.
    const saveJobResult = await saveJob(
      title,
      selectedDao,
      editorContent,
      isPublic
    )

    if (saveJobResult) {
      await saveTags(saveJobResult[0].job_id, selectedTags)
    }

    return saveJobResult
  }

  function onTestSubmit(data) {
    console.log(data)
  }

  // ****************************************
  // HANDLE DATA SUBMIT
  // ****************************************

  // Handles data submit.
  async function onSubmit(data) {
    console.log('SubmitData', data)

    const { title, selectedDao, editorContent, selectedTags, isPublic } = data
    console.log(selectedTags)

    // Verify users' address.
    const isVerified = await verifyAddressOwnership(
      currentAccount,
      ethersProvider
    )

    // Exit process if the users' address can't be verified.
    if (!isVerified) {
      return
    }

    // Save data to DB.
    const result = await saveToDB(
      title,
      selectedDao,
      editorContent,
      selectedTags,
      isPublic
    )

    // If result if false, exit function.
    if (!result) {
      console.log('Could not save data to DB.')
      // TODO: Handle error message.
      return
    } else {
      console.log('Successfully saved to DB.')

      console.log({ isPublic })

      // If isPublic is true, save object to Algolia to be indexed.
      if (isPublic === 'true') {
        // Extract tag names.
        const selectedTagNames = []
        const selectedTagColors = []

        selectedTags.length &&
          selectedTags.map((selectedTagId) => {
            tags.map((tag) => {
              if (tag.tag_id === selectedTagId) {
                selectedTagNames.push(tag.name)
                selectedTagColors.push(tag.color_code)
              }
            })
          })

        const algoliaObject = {
          objectID: result[0].job_id,
          title: title,
          dao: selectedDao.name,
          daoLogo: selectedDao.logo_url,
          tags: selectedTagNames,
          tagColors: selectedTagColors
        }

        await saveToAlgolia(algoliaObject)
      }

      // Redirect user to the newly created job post.
      router.push(`/job/${result[0].job_id}`)
    }
  }

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <MetaTags
        title="Crewdeck - Post Job"
        description="Manage job and bounties for your DAO with Crewdeck. Post jobs for potential contributors. "
      />

      <div className="py-md max-w-4xl mx-auto px-4 sm:px-0">
        {/* Form - START */}
        <form
          className="space-y-8 divide-y divide-slate-200"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-8 divide-y divide-slate-200">
            <div>
              <div>
                <h1 className="text-3xl leading-6 font-medium text-slate-900">
                  Post a Job
                </h1>
                {daoSelectorIsReady && !daoSelectorOptions?.length && (
                  <p className="mt-1 text-sm text-red-500">
                    {`You don't have any NFT assigned by DAO. You cannot post jobs. `}
                  </p>
                )}
              </div>

              <div>
                {/* Title - START */}
                <div className="mt-sm">
                  <JobTitleFormField errors={errors} register={register} />
                  {/* Title - END */}
                </div>

                {/* DAO Selector - START */}
                <div className="mt-sm w-2/3 sm:w-1/3">
                  <JobDaoFormField
                    Controller={Controller}
                    control={control}
                    errors={errors}
                    daoSelectorIsReady={daoSelectorIsReady}
                    daoSelectorOptions={daoSelectorOptions}
                  />
                </div>
                {/* DAO Selector - END */}

                {/* Editor - START */}
                <div className="mt-sm">
                  <JobDescriptionFormField
                    Controller={Controller}
                    control={control}
                  />
                </div>
                {/* Editor - END */}

                {/* Tags - END */}
                <div className="mt-sm">
                  <JobTagsFormField tags={tags} register={register} />
                </div>
                {/* Tags - END */}

                {/* Public Settings - START */}
                <div className="mt-sm">
                  <JobPublicSettingsFormField register={register} />
                </div>
                {/* Public Settings - END */}
              </div>
            </div>
          </div>
          {/* Submit Button - START */}
          <div className="pt-5 flex justify-end">
            <button
              disabled={!daoSelectorOptions?.length}
              className={classNames(
                daoSelectorOptions.length
                  ? 'bg-primary cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed',
                'py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white'
              )}
              type="submit"
            >
              Post
            </button>
          </div>
          {/* Submit Button - END */}
        </form>
        {/* Form - END */}
      </div>
    </>
  )
}

PostJob.Layout = BaseLayout

export const getStaticProps = async () => {
  const { data: daos } = await supabase
    .from('daos')
    .select('dao_id, name, logo_url, contract_address')

  // Get all tags.
  const { data: tags } = await supabase
    .from('tags')
    .select('tag_id, name, color_code')

  return { props: { daos, tags } }
}
