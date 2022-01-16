import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import sanitizeHTML from 'sanitize-html'
import { useRouter } from 'next/router'

// Supabase
import { supabase } from '@libs/supabase'

// Assets
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/solid'

// Functions
import { AccountProvider } from '@libs/accountProvider'
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { verifyAddressOwnership } from '@utils/verifyAddressOwnership'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'

// Constants
import { statusOptions } from '@constants/statusOptions'

export default function Bounty({ bounty, dao, daos }) {
  console.log({ bounty, dao })

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

  // console.log({ daoSelectorOptions, isEditAuth })

  useEffect(() => {
    if (currentAccount) {
      detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions)
    }
  }, [currentAccount, daos])

  useEffect(() => {
    const editable = daoSelectorOptions.some((detectedDao) => {
      return detectedDao.dao_id == bounty.dao_id
    })

    setIsEditAuth(editable)
  }, [daoSelectorOptions, bounty.dao_id])

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

  async function updateBountyStatus(e) {
    e.preventDefault()

    console.log(currentAccount)

    const { data, error } = await supabase
      .from('bounties')
      .update({ status: statusOptions[1], contributor: currentAccount })
      .match({ bounty_id: bounty.bounty_id })

    if (error) {
      console.log(error)
      return
    }

    router.reload()
    return
  }

  console.log({ bounty })

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      {/* Metatags - START */}
      <MetaTags
        title="Bounty Detail"
        description={`Manage bounty and bounties for your DAO with Crewdeck. Check bounties from ${dao.name}.`}
      />
      {/* Metatags - END */}

      {/* Contribute Button (SP) - START */}
      {!bounty.contributor && (
        <div className="fixed w-full bg-slate-200 bottom-0 shadow-around sm:hidden">
          <div className="flex justify-center py-4">
            <button
              className={
                'bg-primary cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white'
              }
              onClick={(e) => {
                updateBountyStatus(e)
              }}
            >
              ✋ &nbsp; Work on this Bounty
            </button>
          </div>
        </div>
      )}
      {/* Contribute Button (SP) - END */}

      {/* Top Menu - START */}
      <div className="mb-4 flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
        <div className="lg:flex-1 flex justify-between items-center">
          {/* Back Link - START */}
          <Link href={'/bounties/browse'}>
            <a className="group inline-flex py-1 px-2 items-center">
              <ChevronLeftIcon className="w-6 h-6 mr-1 text-slate-600 group-hover:text-slate-500" />
              <span className="text-slate-600 group-hover:text-slate-500">
                Back
              </span>
            </a>
          </Link>
          {/* Back Link - END */}
          {/* Edit Link - START */}
          {isEditAuth && (
            <Link href={`/bounties/${bounty.bounty_id}/edit`}>
              <a className="group inline-flex items-center mx-xs text-slate-600 hover:text-slate-800">
                <PencilIcon className="w-4 h-4 mr-1 text-slate-600 group-hover:text-slate-500" />
                <span className="text-slate-600 group-hover:text-slate-500 font-bold text-sm">
                  Edit
                </span>
              </a>
            </Link>
          )}
          {/* Edit Link - END */}
        </div>
        {/* Contribution Button - START */}
        <div className="hidden sm:block lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80">
          <div className="flex justify-end max-w-7xl mx-auto">
            {!bounty.contributor && (
              <button
                className={
                  'bg-primary cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white'
                }
                onClick={(e) => {
                  updateBountyStatus(e)
                }}
              >
                ✋ &nbsp; Work on this Bounty
              </button>
            )}
          </div>
        </div>
        {/* Contribution Button - END */}
      </div>
      {/* Top Menu - END */}

      {/* Grid - START */}
      <div className="flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
        {/* Bounty - START */}
        <div className="lg:flex-1 bg-white p-xs border border-slate-300 rounded-md">
          {/* Bounty Title - START */}
          <div>
            <h1 className="text-lg sm:text-2xl">{bounty.title}</h1>
          </div>
          {/* Bounty Title - END */}
          {/* Bounty Tags - START */}
          {bounty.tags.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap justify-start gap-2">
                {bounty.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-0.5 rounded text-xs text-slate-800"
                    style={{ backgroundColor: tag.color_code }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Bounty Tags - END */}
          {/* Bounty Description - START */}
          <div className="mt-lg">
            <article
              className="prose"
              dangerouslySetInnerHTML={composeInnerHTML(bounty.description)}
            />
          </div>
          {/* Bounty Description - END */}
        </div>
        {/* Bounty - END */}

        {/* Sidebar - START */}
        <div className="lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80">
          <div className="bg-slate-50 border border-slate-300 p-xs rounded-md">
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
              <h1 className="text-lg font-bold">{dao.name}</h1>
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
    </>
  )
}

Bounty.Layout = BaseLayout

export const getStaticPaths = async () => {
  // Get all ids in bounties table.
  const { data: bounties } = await supabase.from('bounties').select('bounty_id')

  const paths = bounties.map(({ bounty_id }) => ({
    params: {
      bountyId: bounty_id.toString()
    }
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { bountyId } }) => {
  // Get bounty info.
  const { data: bounty } = await supabase
    .from('bounties')
    .select('*')
    .eq('bounty_id', bountyId)
    .single()

  // Get tag_ids.
  const { data: tagIdList } = await supabase
    .from('bounties_to_tags')
    .select('tag_id')
    .eq('bounty_id', bountyId)

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

    // Insert tags data into bounty object.
    bounty.tags = tags
  } else {
    // If tags don't exist, set an empty array for bounty.tags element.
    bounty.tags = []
  }

  // Get info on the DAO that posted the bounty.
  const { data: dao } = await supabase
    .from('daos')
    .select('*')
    .eq('dao_id', bounty.dao_id)
    .single()

  const { data: daos } = await supabase
    .from('daos')
    .select('dao_id, name, logo_url, contract_address')

  return { props: { bounty, dao, daos } }
}
