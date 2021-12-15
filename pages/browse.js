import { Fragment } from 'react'
import Link from 'next/link'
import useSWR from 'swr'

// Assets
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/solid'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
import { Popover, Transition } from '@headlessui/react'

export default function Browse() {
  const jobs = [
    {
      id: '2',
      title: 'We need a React engineer.',
      description: 'So, we need a React engineer.',
      is_public: true,
      tags: [
        { id: '1', name: 'non-technical' },
        { id: '2', name: 'graphics' }
      ]
    },
    {
      id: '4',
      title: "We'd like to implement an awesome NFT project.",
      description: "Hi, this is me. Let's go!",
      is_public: false,
      tags: [
        { id: '2', name: 'graphics' },
        { id: '3', name: 'NFT' }
      ]
    },
    {
      id: '5',
      title: 'Check what tags exist',
      description: 'aaaaaa',
      is_public: true,
      tags: [{ id: '1', name: 'non-technical' }]
    },
    {
      id: '6',
      title: 'another test',
      description: 'this job has no tag...',
      is_public: true,
      tags: []
    }
  ]

  const DAOs = [
    { id: '1', name: 'buildspace' },
    { id: '2', name: 'Klima DAO' },
    { id: '3', name: 'Crypto, Culture, and Society aaaaaaaaa' }
  ]

  const tags = [
    { id: '1', name: 'non-technical' },
    { id: '2', name: 'graphics' },
    { id: '3', name: 'NFT' }
  ]

  return (
    <>
      <SEO title="Browse" description="Browse Jobs" />
      {/* Grid - START */}
      <div className="py-xs sm:py-md block sm:flex spacing-x-4">
        {/* Filter - START */}
        <div className="hidden sm:block sm:flex-shrink-1 px-sm w-72">
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
              {DAOs.map((dao) => {
                return (
                  <div key={dao.id} className="mt-2 relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        name="tag"
                        type="checkbox"
                        className="focus:ring-primary h-4 w-4 text-teal-400  border-gray-300 rounded"
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
        </div>
        {/* Filter - END */}
        {/* Filter SP - START */}
        <div className="block sm:hidden px-sm">
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
                          {DAOs.map((dao) => {
                            return (
                              <div
                                key={dao.id}
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
        </div>
        {/* Filter SP - END */}
        {/* Filter Results - START */}
        <main className="flex-1 px-sm mt-sm sm:mt-0 max-w-4xl">
          {jobs.map((job) => {
            return (
              job.is_public && (
                <div key={job.id} className="mb-4 sm:mb-sm">
                  <Link href={`/jobs/${job.id}`}>
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
        </main>
        {/* Filter Results - END */}
      </div>
      {/* Grid - END */}
    </>
  )
}

Browse.Layout = BaseLayout