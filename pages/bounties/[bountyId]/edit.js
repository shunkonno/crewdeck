import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// Supabase
import { supabase } from '@libs/supabase'

// Functions
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { verifyAddressOwnership } from '@utils/verifyAddressOwnership'
import { AccountProvider } from '@libs/accountProvider'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import { BountyTagsCheckboxes } from '@components/ui/Checkboxes'
import { BountyTitleTextArea } from '@components/ui/TextInput'

// Constants
import { statusOptions } from '@constants/statusOptions'
import { DaoSelectBox } from '@components/ui/SelectBox'

// React-Hook-Form
import { useForm, Controller } from 'react-hook-form'

// Quill Editor - Dynamic import to prevent SSR --- https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function EditBounty({ bounty, dao, tags, daos }) {
  // console.log({ bounty, dao, tags })

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
      return detectedDao.dao_id == bounty.dao_id
    })

    setIsEditAuth(editable)
  }, [daoSelectorOptions, bounty.dao_id])

  // ****************************************
  // FORM SETTINGS
  // ****************************************
  // tags????????????tag_id?????????????????????value false??????????????????????????????
  const tagsStateObject = tags.reduce((accum, tag) => {
    return { ...accum, [tag.tag_id]: false }
  }, {})

  const [title, setTitle] = useState(bounty.title || '')
  const [editorContent, setEditorContent] = useState(bounty.description)
  const [selectedDao, setSelectedDao] = useState(dao)
  const [selectedTags, setSelectedTags] = useState(tagsStateObject)

  console.log('Title: ', title)

  // React Hook Form Setting
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  Object.keys(errors).length && console.log('react-hook-form Errors', errors)

  // ****************************************
  // QUILL SETTINGS
  // ****************************************
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote']
    ]
  }

  // ****************************************
  // onSubmit
  // ****************************************
  function onSubmit(validatedData) {
    const submitData = {
      ...validatedData,
      editorContent,
      selectedDao
    }

    console.log('submitData:', submitData)
  }

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <MetaTags
        title="Crewdeck - Edit Bounty"
        description="Manage bounty and bounties for your DAO with Crewdeck. Check bounties to work for a DAO. "
      />
      {/* Wrapper Component -- START */}
      <div>
        {!daoSelectorIsReady ? (
          /*  Loading Spinner -- START */
          <div className="inline-flex justify-center w-full">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : /*  Loading Spinner -- END */
        !isEditAuth ? (
          <p>{`You don't have permission to edit this.`}</p>
        ) : (
          /*  Form -- START */
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
              <div className="lg:flex-1 flex justify-end">
                <div>
                  <Link href={`/bounties/${bounty.bounty_id}`}>
                    <a className="my-1 text-slate-600 mr-6 text-sm font-bold inline-block hover:text-slate-800">
                      Cancel
                    </a>
                  </Link>
                  <button
                    className="px-4 py-1 bg-primary text-white text-sm font-bold inline-block rounded-md cursor-pointer hover:bg-primary-hover hover:text-slate-100"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="hidden sm:block lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80"></div>
            </div>

            {/* Grid - START */}
            <div className="flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2">
              {/* Bounty - START */}
              <div className="lg:flex-1 bg-white p-xs border border-slate-300 rounded-md">
                {/* Bounty Title - START */}
                <div>
                  <fieldset>
                    <legend className="sr-only">Title</legend>
                    <Controller
                      control={control}
                      name="title"
                      defaultValue={bounty.title}
                      rules={{ required: true, maxLength: 200 }}
                      render={({ field: { onChange, value, name } }) => (
                        <BountyTitleTextArea
                          onChange={onChange}
                          title={value}
                          control={control}
                          name={name}
                          setTitle={setTitle}
                        />
                      )}
                    />
                  </fieldset>
                </div>
                {/* Bounty Title - END */}
                {/* Bounty Tags - START */}
                <div className="mt-4">
                  <BountyTagsCheckboxes
                    tags={tags}
                    register={register}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                  />
                </div>
                {/* Bounty Tags - END */}

                {/* Bounty Description - START */}
                <div className="mt-lg">
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={editorContent}
                    onChange={setEditorContent}
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
          </form>
        )}
      </div>
      {/* Wrapper Component -- END */}
    </>
  )
}

EditBounty.Layout = BaseLayout

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

  const { data: daos } = await supabase.from('daos').select('*')

  const { data: tags } = await supabase.from('tags').select('*')

  return { props: { bounty, dao, tags, daos } }
}
