import { useState, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import sanitizeHTML from 'sanitize-html'
import { useRouter } from 'next/router'

// Supabase
import { supabase } from '@libs/supabase'

// Functions
import { AccountProvider } from '@libs/accountProvider'
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { verifyAddressOwnership } from '@utils/verifyAddressOwnership'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'

// Constants
import { statusOptions } from '@constants/statusOptions'

export default function Job({ job, dao, daos }) {
  console.log({ job, dao })

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
  // Edit Button
  // ****************************************

  // Dao Options UI Control State
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [isEditAuth, setIsEditAuth] = useState(false)

  console.log(daoSelectorOptions)
  console.log(isEditAuth)

  useLayoutEffect(() => {
    if (currentAccount) {
      detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions)
    }
  }, [currentAccount, daos])

  useLayoutEffect(() => {
    const editable = daoSelectorOptions.some((detectedDao) => {
      return detectedDao.dao_id == job.dao_id
    })

    setIsEditAuth(editable)
  }, [daoSelectorOptions, job.dao_id])

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
  // DB
  // ****************************************

  async function updateJobStatus(e) {
    e.preventDefault()

    console.log(currentAccount)

    const { data, error } = await supabase
      .from('jobs')
      .update({ status: statusOptions[1], lead_contributor: currentAccount })
      .match({ job_id: job.job_id })

    if (error) {
      console.log(error)
      return
    }

    router.reload()
  }

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <MetaTags
        title="Job Detail"
        description={`Manage job and bounties for your DAO with Crewdeck. Check jobs from ${dao.name}.`}
      />
      <div className="py-md">
        <div className="mb-2 flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
          <div className="lg:flex-1 flex justify-end">
            {isEditAuth && (
              <Link href={`/job/${job.job_id}/edit`}>
                <a className="mx-xs my-1 text-slate-600 text-lg inline-block rounded-md hover:text-slate-800">
                  Edit
                </a>
              </Link>
            )}
          </div>
          <div className="lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80">
            {!job.lead_contributor && (
              <div className="flex justify-end max-w-7xl mx-auto">
                <button
                  className={
                    'bg-primary cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white'
                  }
                  onClick={(e) => {
                    updateJobStatus(e)
                  }}
                >
                  ✋ &nbsp; Work on this Bounty
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Grid - START */}
        <div className="flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
          {/* Job - START */}
          <div className="lg:flex-1 bg-white p-xs border border-slate-300 rounded-lg">
            {/* Job Title - START */}
            <div>
              <h1 className="text-2xl font-semibold">{job.title}</h1>
            </div>
            {/* Job Title - END */}
            {/* Job Tags - START */}
            {job.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap justify-start gap-2">
                  {job.tags.map((tag) => (
                    <div key={tag.id}>
                      <span className="inline-block items-center px-2 py-0.5 rounded text-sm font-medium bg-slate-200 text-slate-800">
                        {tag.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div className="inline-flex items-center">
                {dao.logo_url && (
                  <div className="relative w-8 h-8 flex-shrink-0 rounded-full mr-3">
                    <Image
                      src={dao.logo_url}
                      layout={'fill'}
                      className="absolute inline-block h-8 w-8 "
                    />
                  </div>
                )}
                <h1 className="text-lg font-semibold">{dao.name}</h1>
              </div>
              <p className="mt-1 text-slate-600">{dao.description}</p>
              {(dao.discord_url || dao.twitter_url) && (
                <div className="inline-flex gap-4 mt-xs">
                  {dao.discord_url && (
                    <a
                      className="relative inline-block w-6 h-6 flex-shrink-0"
                      href={dao.discord_url}
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
                  {dao.twitter_url && (
                    <a
                      className="relative inline-block w-6 h-6 flex-shrink-0"
                      href={dao.twitter_url}
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
      </div>
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
    .select('dao_id, name, logo_url, contract_address')

  return { props: { job, dao, daos } }
}
