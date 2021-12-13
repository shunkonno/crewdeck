import Link from 'next/link'
import useSWR from 'swr'

// Assets
import { SearchIcon } from '@heroicons/react/solid'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'

export default function Home() {
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
      <SEO title="Crewdeck" description="Crewdeck's Top Page" />
      {/* Grid - START */}
      <div className="py-md flex spacing-x-4">
        {/* Filter - START */}
        <div className="flex-shrink-1 px-sm w-72">
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
        {/* Filter Results - START */}
        <main className="flex-1 px-sm max-w-4xl">
          {jobs.map((job) => {
            return (
              job.is_public && (
                <div key={job.id} className="mb-sm">
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

Home.Layout = BaseLayout
