import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import Image from 'next/image'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import { JobFilterPopover } from '@components/ui/Popover'

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
  // ****************************************
  // ALGOLIA
  // ****************************************

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
  )

  function Hit(props) {
    console.log(props.hit)

    const tagsForRender = []

    props.hit.tags &&
      props.hit.tags.map((tag, index) => {
        tagsForRender.push({
          name: tag,
          color_code: props.hit.tagColors[index]
        })
      })

    console.log(tagsForRender)

    // ****************************************
    // RETURN
    // ****************************************

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
                <div className="mt-2 inline-flex gap-2 items-center">
                  {props.hit.daoLogo && (
                    <div className="relative w-6 h-6">
                      <Image
                        src={props.hit.daoLogo}
                        layout={'fill'}
                        className=""
                      />
                    </div>
                  )}

                  <h3 className="text-sm">{props.hit.dao}</h3>
                </div>
                {tagsForRender.length > 0 && (
                  <div className="mt-2 inline-flex w-full gap-2 flex-wrap">
                    {tagsForRender.map((tag) => (
                      <span
                        key={tag.name}
                        className="inline-block px-2 py-0.5 rounded text-sm font-medium text-slate-800"
                        style={{ backgroundColor: tag.color_code }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <>
      <MetaTags title="Browse" description="Browse Jobs" />
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
            <h1 className="text-3xl font-bold hidden sm:block mb-4">Jobs</h1>
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
