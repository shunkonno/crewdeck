import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
import {JobFilterPopover} from '@components/ui/Popover'

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

  // const [daoFilter, setDaoFilter] = useState({})
  // const [tagFilter, setTagFilter] = useState({})

  // function changeFilterState(filterType, id, state) {
  //   if (filterType === 'dao') {
  //     setDaoFilter({ ...daoFilter, [id]: state })
  //   } else if (filterType === 'tag') {
  //     setTagFilter({ ...tagFilter, [id]: state })
  //   }
  // }

  // async function getSearchResults() {
  //   // Base query.
  //   let query = supabase.from('jobs').select('created_at, title, dao_id')

  //   // Get ids to filter for.
  //   const daoFilterIds = Object.keys(daoFilter).filter((key) => {
  //     return daoFilter[key]
  //   })

  //   const tagFilterIds = Object.keys(tagFilter).filter((key) => {
  //     return tagFilter[key]
  //   })

  //   // **************************************************
  //   // DAO FILTER
  //   // **************************************************

  //   // Filter DAO.
  //   if (daoFilterIds.length > 0) {
  //     let daoFilterString = ''

  //     daoFilterIds.map((daoId, index) => {
  //       if (index !== daoFilterIds.length - 1) {
  //         // Add a trailing comma until the last element.
  //         daoFilterString += `dao_id.eq.${String(daoId)},`
  //       } else {
  //         daoFilterString += `dao_id.eq.${String(daoId)}`
  //       }
  //     })

  //     // Chain base query.
  //     query = query.or(daoFilterString)
  //   }

  //   // **************************************************
  //   // TAG FILTER
  //   // **************************************************

  //   // Get jobs with filtered tags.
  //   if (tagFilterIds.length > 0) {
  //     let tagFilterString = ''

  //     tagFilterIds.map((tagId, index) => {
  //       if (index !== tagFilterIds.length - 1) {
  //         // Add a trailing comma until the last element.
  //         tagFilterString += `tag_id.eq.${String(tagId)},`
  //       } else {
  //         tagFilterString += `tag_id.eq.${String(tagId)}`
  //       }
  //     })

  //     const { data: jobIdWithTag } = await supabase
  //       .from('jobs_to_tags')
  //       .select('job_id')
  //       .or(tagFilterString)

  //     console.log({ jobIdWithTag })

  //     // Filter query with job_id associated with tags.
  //     if (jobIdWithTag.length > 0) {
  //       let jobIdFilterString = ''

  //       jobIdWithTag.map((item, index) => {
  //         if (index !== jobIdWithTag.length - 1) {
  //           // Add a trailing comma until the last element.
  //           jobIdFilterString += `id.eq.${String(item.job_id)},`
  //         } else {
  //           jobIdFilterString += `id.eq.${String(item.job_id)}`
  //         }
  //       })

  //       // Append job_id filter to base query.
  //       query = query.or(jobIdFilterString)
  //     }
  //   }

  //   const { data: jobs, error } = await query

  //   console.log({ jobs })

  //   return jobs
  // }

  // useEffect(() => {
  //   getSearchResults()
  // }, [daoFilter, tagFilter])

  function Hit(props) {
    console.log(props.hit)
    return (
      <div key={props.hit.objectID} className="mb-4 sm:mb-sm">
        <Link href={`/job/${props.hit.objectID}`}>
          <a>
            <div className="w-full border shadow-sm border-slate-300 rounded-md bg-white">
              <div className="px-4 py-2">
                <div>
                  <h2 className="text-lg font-medium truncate">
                    {props.hit.title}
                  </h2>
                </div>
                <div className='inline-flex'>
                  {/* <img src={props.hit.logo_url} className='w-6 h-6' /> */}
                  <h3 className="text-sm">{props.hit.dao}</h3>
                </div>
                <div className='mt-4 inline-flex w-full gap-2 flex-wrap'>
                  {props.hit.tags.map((tag)=>(
                    <span className='bg-slate-200 px-3 rounded-md text-sm'>
                      {tag}
                    </span>
                  ))}
                </div>
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
      <div className="py-md max-w-5xl mx-auto px-xs sm:px-0 block sm:flex spacing-x-4">
        
        <InstantSearch searchClient={searchClient} indexName="jobs">
          <JobFilterPopover RefinementList={RefinementList} />
          <div className="hidden sm:block sm:flex-shrink-1 px-sm w-72">
            <div>
              <h3 className="text-sm font-medium pb-2">DAO</h3>
              <div className="mt-2">
                <RefinementList
                  attribute="dao"
                  searchable
                  translations={{ placeholder: 'Type to filter DAO' }}
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium pb-2">Tag</h3>
              <RefinementList attribute="tags" />
            </div>
          </div>
          <main className="flex-1 mt-xs sm:mt-0 max-w-4xl">
            <h1 className="text-3xl font-bold hidden sm:block mb-4">Find Job</h1>
            <Hits hitComponent={Hit} />
          </main>
        </InstantSearch>
      </div>
      {/* Search - END */}
    </>
  )
}

Browse.Layout = BaseLayout

export const getStaticProps = async () => {
  // Get all tags.
  const { data: tags } = await supabase
    .from('tags')
    .select('tag_id, name, color_code')

  console.log(tags)
  // Get all DAOs.
  const { data: daos } = await supabase.from('daos').select('dao_id, name')

  return { props: { tags, daos } }
}
