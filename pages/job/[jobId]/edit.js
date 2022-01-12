import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import sanitizeHTML from 'sanitize-html'
import { useRouter } from 'next/router'

// Supabase
import { supabase } from '@libs/supabase'

// Assets
import { ChevronDownIcon } from '@heroicons/react/outline'

// Functions
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { verifyAddressOwnership } from '@utils/verifyAddressOwnership'
import { AccountProvider } from '@libs/accountProvider'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import { JobTagsCheckboxes } from '@components/ui/Checkboxes'

import { useForm, Controller } from 'react-hook-form'

// Constants
import { statusOptions } from '@constants/statusOptions'
import { DaoSelectBox } from '@components/ui/SelectBox'

export default function Job({ job, dao, tags, daos }) {
  console.log({ job, dao, tags })

  // ****************************************
  // ACCOUNT
  // ****************************************

  const accountProvider = AccountProvider()
  const { currentAccount } = accountProvider

  // ****************************************
  // ROUTER
  // ****************************************

  const router = useRouter()

  // ****************************************
  // UI CONTROL STATE
  // ****************************************

  // Dao Options UI Control State
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [daoSelectorIsReady, setDaoSelectorIsReady] = useState(false)
  const [isEditAuth, setIsEditAuth] = useState(false)


  useEffect(() => {
    if (currentAccount) {
      detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions).then(() => {
        setDaoSelectorIsReady(true)
      })
    }
  }, [currentAccount, daos])

  useEffect(() => {
    const editable = daoSelectorOptions.some((detectedDao) => {
      return detectedDao.dao_id == job.dao_id
    })

    setIsEditAuth(editable)
  }, [daoSelectorOptions, job.dao_id])

  // ****************************************
  // FORM SETTINGS
  // ****************************************
  const [title, setTitle] = useState(job.title || '')
  const [description, setDescription] = useState(null)
  const [selectedDao, setSelectedDao] = useState(dao)

console.log(selectedDao)
  // tagsの数だけtag_idをキーの持つ、value falseのオブジェクトを作る
  const tagsStateObject = tags.reduce((accum, tag) => {
    return { ...accum, [tag.tag_id]: false }
  }, {})
  const [selectedTags, setSelectedTags] = useState(tagsStateObject)

  // React Hook Form Setting
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  Object.keys(errors).length && console.log('react-hook-form Errors', errors)

  // ****************************************
  // HANDLE INNER HTML
  // ****************************************

  // Sanitizes HTML.
  // @param {string} rawHtml
  // @returns {string} sanitizedHtml
  function composeSanitizedHTML(rawHTML) {
    const options = {
      allowedTags: [
        'h1',
        'h2',
        'h3',
        'li',
        'ol',
        'p',
        'ul',
        'a',
        'br',
        'u',
        'em',
        'strong',
        'blockquote'
      ],
      allowedAttributes: {
        a: ['href', 'rel', 'target']
      }
    }

    const sanitizedHTML = sanitizeHTML(rawHTML, options)

    return sanitizedHTML
  }

  // Returns object to set using dangerouslySetInnerHTML
  // @param {string} rawHtml
  // @returns {striing} sanitizedHtml
  function composeInnerHTML(rawHTML) {
    // Sanitize HTML.
    const sanitizedHTML = composeSanitizedHTML(rawHTML)
    // Return HTML as object.
    return { __html: sanitizedHTML }
  }

  // ****************************************
  // onSubmit
  // ****************************************
  function onTestSubmit(data) {
    console.log(data)
  }

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <MetaTags
        title="Crewdeck - Job Detail"
        description="Manage job and bounties for your DAO with Crewdeck. Check jobs to work for a DAO. "
      />
      {/* Wrapper Component -- START */}
      <div className="max-w-7xl mx-auto py-md">
      {!isEditAuth ? 
        <p>You don't have the authentication to edit this job information</p>
      :
        <form onSubmit={handleSubmit(onTestSubmit)}>
          <div className="mb-2 flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
            <div className="lg:flex-1 flex justify-end">
              <div>
                <Link href={`/job/${job.job_id}`}>
                  <a className="my-1 text-slate-600 mr-6 text-lg inline-block rounded-lg hover:text-slate-800">
                    Cancel
                  </a>
                </Link>
                <button 
                  className="px-xs py-1 bg-primary text-white text-lg inline-block rounded-lg cursor-pointer hover:bg-primary-hover hover:text-slate-100"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80"></div>
          </div>
          
          {/* Grid - START */}
          <div className="flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2">
            {/* Job - START */}
            <div className="lg:flex-1 bg-white p-xs border border-slate-300 rounded-lg">
              {/* Job Title - START */}
              <div>
                <input 
                  type="text" 
                  className="text-2xl font-medium border-b border-slate-400 w-full outline-none focus:border-teal-400" 
                  onChange={((e) => setTitle(e.target.value))}
                  value={title}
                  {...register('title', {
                    required: true,
                    maxLength: 200
                  })}
                />
              </div>
              {/* Job Title - END */}
              {/* Job Tags - START */}
              <div className="mt-4">
                <JobTagsCheckboxes 
                  tags={tags} 
                  register={register}
                  selectedTags={selectedTags} 
                  setSelectedTags={setSelectedTags}
                />
              </div>
              {/* Job Tags - END */}
              {/* Job Description - START */}
              <div className="mt-lg">
                <article
                  className="prose"
                  dangerouslySetInnerHTML={composeInnerHTML(job.description)}
                />
              </div>
              {/* Job Description - END */}
            </div>
            {/* Job - END */}
            {/* Sidebar - START */}
            <div className="lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80">
              <div className="bg-white border border-slate-300 p-xs rounded-lg">
                <DaoSelectBox 
                  selectedDao={selectedDao}
                  setSelectedDao={setSelectedDao}
                  daoSelectorIsReady={daoSelectorIsReady}
                  daoSelectorOptions={daoSelectorOptions}
                  label={'Select DAO'}
                />
                <p className="mt-2 text-slate-600">{selectedDao.description}</p>
                {(selectedDao.discord_url || selectedDao.twitter_url) && (
                  <div className="inline-flex gap-4 mt-xs">
                    {selectedDao.discord_url && (
                      <a
                        className="relative inline-block w-6 h-6 flex-shrink-0"
                        href={selectedDao.discord_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          src={'/images/social/DiscordIcon.png'}
                          layout={'fill'}
                          className=""
                        />
                      </a>
                    )}
                    {selectedDao.twitter_url && (
                      <a
                        className="relative inline-block w-6 h-6 flex-shrink-0"
                        href={selectedDao.twitter_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          layout={'fill'}
                          src={'/images/social/TwitterIcon.png'}
                        />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Sidebar - END */}
          </div>
          {/* Grid - END */}
        </form>
      }
      </div>
      {/* Wrapper Component -- END */}
    </>
  )
}

Job.Layout = BaseLayout

export const getStaticPaths = async () => {
  // Get all ids in jobs table.
  const { data: jobs } = await supabase.from('jobs').select('job_id')

  const paths = jobs.map(({ job_id }) => ({
    params: {
      jobId: job_id.toString()
    }
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { jobId } }) => {
  // Get job info.
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('job_id', jobId)
    .single()

  // Get tag_ids.
  const { data: tagIdList } = await supabase
    .from('jobs_to_tags')
    .select('tag_id')
    .eq('job_id', jobId)

  // If tags exist:
  if (tagIdList.length > 0) {
    // Compose query string for Supabase.
    let tagIdListString = ''

    tagIdList.map((item, index) => {
      if (index !== tagIdList.length - 1) {
        // Add a trailing comma until the last element.
        tagIdListString += 'tag_id.eq.'
        tagIdListString += String(item.tag_id) + ','
      } else {
        tagIdListString += 'tag_id.eq.'
        tagIdListString += String(item.tag_id)
      }
    })

    // Get tags.
    const { data: tags } = await supabase
      .from('tags')
      .select('*')
      .or(tagIdListString)

    // Insert tags data into job object.
    job.tags = tags
  } else {
    // If tags don't exist, set an empty array for job.tags element.
    job.tags = []
  }

  // Get info on the DAO that posted the job.
  const { data: dao } = await supabase
    .from('daos')
    .select('*')
    .eq('dao_id', job.dao_id)
    .single()

  const { data: daos } = await supabase
  .from('daos')
  .select('*')

  const { data: tags } = await supabase
    .from('tags')
    .select('*')

  return { props: { job, dao, tags, daos } }
}
