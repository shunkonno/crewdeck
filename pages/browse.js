import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'

// Assets
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/solid'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
import { Popover, Transition } from '@headlessui/react'

// Functions
import classNames from 'classnames'

// Supabase
import { supabase } from '@libs/supabase'

// Algolia
import algoliasearch from 'algoliasearch'
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList
} from 'react-instantsearch-dom'

export default function Browse({ tags, daos }) {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
  )

  const [daoFilter, setDaoFilter] = useState({})
  const [tagFilter, setTagFilter] = useState({})

  
  const tagsStateObject = tags.reduce((accum,tag) => {
    return  { ...accum, [tag.tag_id] : false }   
  },{})

  const [selectedTags, setSelectedTags] = useState(tagsStateObject)

  function changeFilterState(filterType, id, state) {
    if (filterType === 'dao') {
      setDaoFilter({ ...daoFilter, [id]: state })
    } else if (filterType === 'tag') {
      setTagFilter({ ...tagFilter, [id]: state })
    }
  }

  async function getSearchResults() {
    // Base query.
    let query = supabase.from('jobs').select('created_at, title, dao_id')

    // Get ids to filter for.
    const daoFilterIds = Object.keys(daoFilter).filter((key) => {
      return daoFilter[key]
    })

    const tagFilterIds = Object.keys(tagFilter).filter((key) => {
      return tagFilter[key]
    })

    // **************************************************
    // DAO FILTER
    // **************************************************

    // Filter DAO.
    if (daoFilterIds.length > 0) {
      let daoFilterString = ''

      daoFilterIds.map((daoId, index) => {
        if (index !== daoFilterIds.length - 1) {
          // Add a trailing comma until the last element.
          daoFilterString += `dao_id.eq.${String(daoId)},`
        } else {
          daoFilterString += `dao_id.eq.${String(daoId)}`
        }
      })

      // Chain base query.
      query = query.or(daoFilterString)
    }

    // **************************************************
    // TAG FILTER
    // **************************************************

    // Get jobs with filtered tags.
    if (tagFilterIds.length > 0) {
      let tagFilterString = ''

      tagFilterIds.map((tagId, index) => {
        if (index !== tagFilterIds.length - 1) {
          // Add a trailing comma until the last element.
          tagFilterString += `tag_id.eq.${String(tagId)},`
        } else {
          tagFilterString += `tag_id.eq.${String(tagId)}`
        }
      })

      const { data: jobIdWithTag } = await supabase
        .from('jobs_to_tags')
        .select('job_id')
        .or(tagFilterString)

      console.log({ jobIdWithTag })

      // Filter query with job_id associated with tags.
      if (jobIdWithTag.length > 0) {
        let jobIdFilterString = ''

        jobIdWithTag.map((item, index) => {
          if (index !== jobIdWithTag.length - 1) {
            // Add a trailing comma until the last element.
            jobIdFilterString += `id.eq.${String(item.job_id)},`
          } else {
            jobIdFilterString += `id.eq.${String(item.job_id)}`
          }
        })

        // Append job_id filter to base query.
        query = query.or(jobIdFilterString)
      }
    }

    const { data: jobs, error } = await query

    console.log({ jobs })

    return jobs
  }

  useEffect(() => {
    getSearchResults()
  }, [daoFilter, tagFilter])

  function Hit(props) {
    return (
      <div key={props.hit.objectID} className="mb-4 sm:mb-sm">
        <Link href={`/jobs/${props.hit.objectID}`}>
          <a>
            <div className="w-full border shadow-sm border-slate-300 rounded-md bg-white">
              <div className="px-4 py-2">
                <div>
                  <h2 className="text-lg font-medium truncate">
                    {props.hit.title}
                  </h2>
                </div>
                <div>
                  <h3 className="text-sm">{props.hit.dao}</h3>
                </div>
                {/* <div className="mt-3">
                    <div className="flex justify-start gap-1">
                      {job.tags &&
                        job.tags.map((tag) => {
                          return (
                            <div key={tag.id}>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                {tag.name}
                              </span>
                            </div>
                          )
                        })}
                    </div>
                </div> */}
              </div>
            </div>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEO title="Browse" description="Browse Jobs" />
      {/* Search - START */}
      <div className="py-md max-w-5xl mx-auto px-4 sm:px-0 block sm:flex spacing-x-4">
        <InstantSearch searchClient={searchClient} indexName="jobs">
          <div className="hidden sm:block sm:flex-shrink-1 px-sm w-72">
            <h3 className="text-sm font-medium">DAO</h3>
            <RefinementList
              attribute="dao"
              searchable
              translations={{ placeholder: 'Type to filter DAO' }}
            />
            <h3 className="text-sm font-medium mt-sm">Tags</h3>
            
            {tags.map((tag) => (
              <span 
                key={tag.tag_id} 
                className={classNames(selectedTags[tag.tag_id] ?
                  "ring-offset-2 ring-2 ring-teal-400"
                  :
                  "font-medium",
                  "inline-block mt-4 items-center px-2 py-0.5 rounded text-sm font-medium text-slate-800 mr-4 cursor-pointer"
                )} 
                style={{ backgroundColor: tag.color_code}}
                onClick={() => setSelectedTags((prev)=> ({...prev, [tag.tag_id]: !prev[tag.tag_id] }))}
              >
                {tag.name}
              </span>
            ))}
            
          </div>
          <main className="flex-1 px-sm mt-sm sm:mt-0 max-w-4xl">
            <Hits hitComponent={Hit} />
          </main>
        </InstantSearch>
        {/* Filter - START */}
        {/* <div className="hidden sm:block sm:flex-shrink-1 px-sm w-72">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="focus:text-primary text-slate-400 w-6 h-6" />
              </div>
              <input
                className="focus:outline-none focus:ring-primary focus:border-primary block w-full pl-10 py-2 sm:text-sm border border-slate-300 rounded-md"
                placeholder="Keywords"
              />
            </div>
          </div>
          <div className="mt-sm">
            <label className="block text-sm font-medium text-slate-700">
              DAO
            </label>
            <div className="mt-2">
              {daos.map((dao) => {
                return (
                  <div key={dao.dao_id} className="mt-2 relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        name="tag"
                        type="checkbox"
                        className="focus:ring-primary h-4 w-4 text-teal-400  border-gray-300 rounded"
                        onChange={(event) => {
                          changeFilterState('dao', dao.dao_id, event.target.checked)
                        }}
                      />
                    </div>
                    <div className="ml-3 text-sm truncate">
                      <span className="text-gray-500">{dao.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-sm">
            <label className="block text-sm font-medium text-slate-700">
              Tags
            </label>
            <div className="mt-2">
              {tags.map((tag) => {
                return (
                  <div key={tag.id} className="mt-2 relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        name="tag"
                        type="checkbox"
                        className="focus:ring-primary h-4 w-4 text-teal-400  border-gray-300 rounded"
                        onChange={(event) => {
                          changeFilterState('tag', tag.id, event.target.checked)
                        }}
                      />
                    </div>
                    <div className="ml-3 text-sm  truncate">
                      <span className="text-gray-500">{tag.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="mt-md bg-primary text-white text-center px-4 py-2 font-semibold rounded-lg shadow-md cursor-pointer">
              Search
            </div>
          </div>
        </div>  */}
        {/* Filter - END */}
        {/* Filter SP - START */}
        {/* <div className="block sm:hidden px-sm">
          <div className="mt-1 flex gap-2 w-full">
            <div className="relative rounded-md shadow-sm flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="focus:text-primary text-slate-400 w-6 h-6" />
              </div>
              <input
                className="focus:outline-none focus:ring-primary focus:border-primary block w-full pl-10 py-2 sm:text-sm border border-slate-300 rounded-md"
                placeholder="Search"
              />
            </div>
            <Popover className="relative flex-shrink-0">
              <Popover.Button>
                <div className="bg-white rounded-full shadow-sm  p-2 flex justify-center items-center border border-slate-300">
                  <AdjustmentsIcon className="h-6 w-6 focus:text-primary text-slate-400" />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen right-0 max-w-sm -mr-sm mt-3 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
                    <div className="p-sm">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          DAO
                        </label>
                        <div>
                          {daos.map((dao) => {
                            return (
                              <div
                                key={dao.dao_id}
                                className="mt-2 relative flex items-start"
                              >
                                <div className="flex items-center h-5">
                                  <input
                                    name="tag"
                                    type="checkbox"
                                    className="focus:ring-primary h-4 w-4 text-teal-400  border-gray-300 rounded"
                                  />
                                </div>
                                <div className="ml-3 text-sm truncate">
                                  <span className="text-gray-500">
                                    {dao.name}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="mt-sm">
                        <label className="block text-sm font-medium text-slate-700">
                          Tags
                        </label>
                        <div className="mt-2">
                          {tags.map((tag) => {
                            return (
                              <div
                                key={tag.id}
                                className="mt-2 relative flex items-start"
                              >
                                <div className="flex items-center h-5">
                                  <input
                                    name="tag"
                                    type="checkbox"
                                    className="focus:ring-primary h-4 w-4 text-teal-400  border-gray-300 rounded"
                                  />
                                </div>
                                <div className="ml-3 text-sm  truncate">
                                  <span className="text-gray-500">
                                    {tag.name}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="mt-md bg-primary text-white text-center px-4 py-2 font-semibold rounded-lg shadow-md cursor-pointer">
                          Search
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        </div> */}
        {/* Filter SP - END */}
        {/* Filter Results - START */}
        {/* <main className="flex-1 px-sm mt-sm sm:mt-0 max-w-4xl">

          {jobs.map((job) => {
            return (
              job.is_public && (
                <div key={job.job_id} className="mb-4 sm:mb-sm">
                  <Link href={`/jobs/${job.job_id}`}>
                    <a>
                      <div className="w-full border shadow-sm border-slate-300 rounded-md bg-white">
                        <div className="px-4 py-2">
                          <div className="result-title">
                            <h2 className="text-lg font-medium truncate">
                              {job.title}
                            </h2>
                          </div>
                          <div className="result-org">
                            <h3 className="text-sm truncate">
                              {job.description}
                            </h3>
                          </div>
                          <div className="mt-3">
                            <div className="result-tag">
                              <div className="flex justify-start gap-1">
                                {job.tags &&
                                  job.tags.map((tag) => {
                                    return (
                                      <div key={tag.id}>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                          {tag.name}
                                        </span>
                                      </div>
                                    )
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )
            )
          })}
        </main> */}
        {/* Filter Results - END */}
      </div>
      {/* Search - END */}
    </>
  )
}

Browse.Layout = BaseLayout

export const getStaticProps = async () => {
  // Get all tags.
  const { data: tags } = await supabase.from('tags').select('tag_id, name, color_code')

  console.log(tags)
  // Get all DAOs.
  const { data: daos } = await supabase.from('daos').select('dao_id, name')

  return { props: { tags, daos } }
}
