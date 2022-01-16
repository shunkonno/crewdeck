import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import { BountyFilterPopover } from '@components/ui/Popover'

// Algolia
import algoliasearch from 'algoliasearch'
import { InstantSearch, Hits, RefinementList } from 'react-instantsearch-dom'

export default function Browse() {
  // ****************************************
  // FILTER STATE
  // ****************************************
  const [selectedDaoFilters, setSelectedDaoFilters] = useState([])
  const [selectedTagFilters, setSelectedTagFilters] = useState([])

  // ****************************************
  // UI CONTROL STATE
  // ****************************************
  const [modalIsOpen, setIsOpen] = useState(false)

  // console.log({ modalIsOpen, selectedDaoFilters })

  // ****************************************
  // ALGOLIA
  // ****************************************
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
  )

  function RenderSearch() {
    return (
      <InstantSearch
        searchClient={searchClient}
        indexName="bounties"
        onSearchStateChange={(searchState) => {
          if (modalIsOpen && searchState.refinementList?.dao !== undefined) {
            searchState.refinementList.dao.length > 0
              ? setSelectedDaoFilters(searchState.refinementList.dao)
              : setSelectedDaoFilters([])
          }

          if (modalIsOpen && searchState.refinementList?.tags !== undefined) {
            searchState.refinementList.tags.length > 0
              ? setSelectedTagFilters(searchState.refinementList.tags)
              : setSelectedTagFilters([])
          }
        }}
      >
        <BountyFilterPopover
          RefinementList={RefinementList}
          selectedDaoFilters={selectedDaoFilters}
          selectedTagFilters={selectedTagFilters}
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
        />
        <div className="hidden sm:block sm:flex-shrink-1 w-72">
          <div>
            <h3 className="text-sm font-bold uppercase text-slate-600">DAO</h3>
            <div className="mt-2">
              <RefinementList
                attribute="dao"
                searchable
                translations={{ placeholder: 'Type to filter DAO' }}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="pb-2">
              <h3 className="text-sm font-bold uppercase text-slate-600">
                Tag
              </h3>
            </div>
            <RefinementList attribute="tags" />
          </div>
        </div>
        <main className="flex-1 mt-xs sm:mt-0 max-w-4xl">
          <Hits hitComponent={Hit} />
        </main>
      </InstantSearch>
    )
  }

  function Hit(props) {
    const tagsForRender = []

    props.hit.tags &&
      props.hit.tags.map((tag, index) => {
        tagsForRender.push({
          name: tag,
          color_code: props.hit.tagColors[index]
        })
      })

    return (
      <div
        key={props.hit.objectID}
        className="mb-4 sm:mb-sm w-full sm:max-w-2xl"
      >
        <Link href={`/bounties/${props.hit.objectID}`}>
          <a>
            <div className="w-full border shadow-sm border-slate-300 rounded-md bg-white">
              <div className="px-4 py-2">
                <div>
                  <h2 className="text-xl truncate">{props.hit.title}</h2>
                </div>
                <div className="mt-2 inline-flex gap-2 items-center">
                  {props.hit.daoLogo && (
                    <div className="relative w-6 h-6">
                      <Image
                        src={props.hit.daoLogo}
                        layout={'fill'}
                        alt={props.hit.dao}
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
                        className="inline-block px-2 py-0.5 rounded text-xs text-slate-800"
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

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      {/* Metatags - START */}
      <MetaTags
        title="Crewdeck - Browse"
        description="Manage bounty and bounties for your DAO with Crewdeck. Browse public bounties and bounties, to lower barriers for contributing."
      />
      {/* Metatags - END */}

      {/* Page Title --- START */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Public Bounties</h1>
      </div>
      {/* Page Title --- END */}

      {/* Search - START */}
      <div className="sm:flex spacing-x-4">
        <RenderSearch />
      </div>
      {/* Search - END */}
    </>
  )
}

Browse.Layout = BaseLayout
