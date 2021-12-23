import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

// Contexts
import { useAccount } from '@contexts/AccountContext'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'

import { 
  JobTitleFormField, 
  JobDescriptionFormField, 
  JobDaoFormField, 
  JobTagsFormField, 
  JobPublicSettingsFormField 
} from '@components/ui/FormField'

// Functions
import classNames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// Supabase
import { supabase } from '@libs/supabase'

export default function PostJob({ daos, tags }) {
  const { currentAccount, ethersProvider } = useAccount()
  const router = useRouter()

  // **************************************************
  // VALUES TO SUBMIT TO SERVER
  // **************************************************

  // tagsの数だけtag_idをキーの持つ、value falseのオブジェクトを作る
  const tagsStateObject = tags.reduce((accum, tag) => {
    return { ...accum, [tag.tag_id]: false }
  }, {})

  const [selectedTags, setSelectedTags] = useState(tagsStateObject)

  // React Hook Form Setting
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm()

  Object.keys(errors).length && console.log('react-hook-form Errors', errors)

  // **************************************************
  // FORM SETTINGS
  // **************************************************

  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [isReadyDaoOptions, setIsReadyDaoOptions] = useState(false)

  // **************************************************
  // HANDLE OPTIONS
  // **************************************************

  // Get token balance for a user's address to validate user's membership in a DAO.
  // @params {string} eoaAddress - The public address of the user.
  // @params {string} contractAddress - The contract address of the NFT for a DAO.
  // @returns {object} tokenBalance - Returns either the balance or an error.
  async function getTokenBalances(eoaAddress, contractAddress) {
    const response = await fetch(
      `/api/alchemy/ethereum/mainnet/getTokenBalances/?user=${eoaAddress}&contract=${contractAddress}`
    )

    const data = await response.json()

    return data
  }

  // Filter the list of DAOs from DB, and filter the ones that the user owns tokens for. Set filtered array to state.
  // @params {array} daoList - The initial list of all DAOs.
  const filterDaoSelectorOptions = useCallback(
    async (daoList) => {
      //Filter DAO Function
      const filterResult = await daoList?.reduce(async (promise, dao) => {
        let accumulator = []
        accumulator = await promise
        const data = await getTokenBalances(
          currentAccount,
          dao.contract_address
        )

        // Get substring of tokenBalance. (e.g. 0x0000000000000000000000000000000000000000000000000000000000000001)
        // If tokenBalance is greater than 0, the user owns at least one token.
        if (Number(data.tokenBalance?.substring(2)) > 0) {
          await accumulator.push(dao)
        }
        return accumulator
      }, [])

      await setDaoSelectorOptions(filterResult)
    },
    [currentAccount]
  )

  useEffect(async () => {
    if (currentAccount) {
      await filterDaoSelectorOptions(daos)
      await setIsReadyDaoOptions(true)
    }
  }, [currentAccount, daos, filterDaoSelectorOptions])

  // **************************************************
  // HANDLE DATA SUBMIT
  // **************************************************

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

    tagIds.map((tagId) => {
      insertObjectList.push({ job_id: jobId, tag_id: tagId })
    })

    const { data: result, saveTagsError } = await supabase
      .from('jobs_to_tags')
      .insert(insertObjectList)

    if (saveTagsError) {
      console.log(error)
      return false
    }

    // Return saved object.
    return result
  }

  // Saves data to DB.
  async function saveToDB(title, selectedDao, editorContent, isPublic) {

    // Save job.
    const saveJobResult = await saveJob(title, selectedDao, editorContent, isPublic)

    if (saveJobResult) {
      // Save tagIds with true bool value.
      const selectedTagIds = Object.keys(selectedTags).filter((key) => {
        return selectedTags[key]
      })

      await saveTags(saveJobResult[0].job_id, selectedTagIds)
    }

    return saveJobResult
  }

  // Verifies if the user holds the private key for the public address. (EIP-191)
  // @returns {bool} isVerified - Returns whether the address has been verified.
  async function verifyAddressOwnership() {
    // Sign a message.
    const signer = ethersProvider.getSigner()
    const message =
      'Please sign this message for verification. This does not incur any gas fees.'
    const signature = await signer.signMessage(message)

    // Get public address used to sign the message.
    const address = ethers.utils.verifyMessage(message, signature)

    // If currentAccount equals address, we know that the user has the private key for the currentAccount.
    const isVerified = currentAccount === address ? true : false

    return isVerified
  }

  function onTestSubmit (data) { console.log(data) }

  // Handles data submit.
  async function onSubmit(data) {
    
    console.log('SubmitData', data) 

    const { title, selectedDao, editorContent, isPublic } = data

    // Verify users' address.
    const isVerified = await verifyAddressOwnership()

    // Exit process if the users' address can't be verified.
    if (!isVerified) {
      return
    }

    // Save data to DB.
    const result = await saveToDB(title, selectedDao, editorContent, isPublic)

    // If result if false, exit function.
    if (!result) {
      console.log('Could not save data to DB.')
      // TODO: Handle error message.
      return
    } else {
      console.log('Successfully saved to DB.')

      // If isPublic is true, save object to Algolia to be indexed.
      if (isPublic) {
        // Extract tags IDs.
        const selectedTagIds = Object.keys(selectedTags).filter((key) => {
          return selectedTags[key]
        })

        // Extract tag names.
        const selectedTagNames = []

        selectedTagIds.map((selectedTagId) => {
          tags.map((tag) => {
            if (tag.tag_id === selectedTagId) {
              selectedTagNames.push(tag.name)
            }
          })
        })

        const algoliaObject = {
          objectID: result[0].job_id,
          title: title,
          dao: selectedDao.name,
          tags: selectedTagNames
        }

        await saveToAlgolia(algoliaObject)
      }

      // Redirect user to the newly created job post.
      router.push(`/job/${result[0].job_id}`)
    }
  }

  return (
    <>
      <SEO title="Post Job" description="Post Job" />

      <div className="py-md max-w-4xl mx-auto px-4 sm:px-0">
        {/* Form - START */}
        <form
          className="space-y-8 divide-y divide-slate-200"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-8 divide-y divide-slate-200">
            <div>
              <div>
                <h1 className="text-2xl leading-6 font-medium text-slate-900">
                  Post a Job
                </h1>
                {isReadyDaoOptions && !daoSelectorOptions?.length && (
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
                    isReadyDaoOptions={isReadyDaoOptions} 
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
                  <JobTagsFormField 
                    tags={tags} 
                    selectedTags={selectedTags} 
                    setSelectedTags={setSelectedTags}
                  />
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
                'py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  '
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
