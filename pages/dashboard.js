import { useState, useEffect } from 'react'

// Supabase
import { supabase } from '@libs/supabase'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import { DaoSelectBox } from '@components/ui/SelectBox'

// Functions
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { AccountProvider } from '@libs/accountProvider'
import { truncateAddress } from '@utils/truncateAddress'

export default function Dashboard({ daos }) {
  // ****************************************
  // ACCOUNT
  // ****************************************

  const accountProvider = AccountProvider()
  const { currentAccount } = accountProvider

  // ****************************************
  // STATE
  // ****************************************

  const [jobs, setJobs] = useState([])

  // ****************************************
  // UI CONTROL STATE
  // ****************************************

  // Dao Options UI Control State
  const [selectedDao, setSelectedDao] = useState(null)
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [daoSelectorIsReady, setDaoSelectorIsReady] = useState(false)

  useEffect(() => {
    if (currentAccount) {
      detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions).then(() => {
        setDaoSelectorIsReady(true)
      })
    }
  }, [currentAccount, daos])

  // ****************************************
  // FETCH DATA
  // ****************************************

  async function getJobsForDao(daoId) {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('job_id, created_at, title, is_public, status, lead_contributor')
      .eq('dao_id', daoId)

    if (error) {
      console.log(error)
      return []
    }

    return jobs
  }

  useEffect(() => {
    if (selectedDao) {
      getJobsForDao(selectedDao.dao_id).then((jobs) => {
        setJobs(jobs)
      })
    }
  }, [selectedDao])

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <MetaTags
        title="Crewdeck - Dashboard"
        description="Manage job and bounties for your DAO with Crewdeck. You can check public and private jobs and bounties for your DAO on the dashboard."
      ></MetaTags>
      <div className="max-w-5xl mx-auto">
        <div className="mt-sm w-2/3 sm:w-1/3">
          <label className="block font-medium text-slate-700">
            Select DAO
          </label>
          <p className="my-1 text-sm text-slate-500">
            Select the DAO you own a token for.
            <br />
            Not in the list?{' '}
            <span>
              <a
                target="_blank"
                className="text-blue-500"
                href="https://docs.google.com/forms/d/1J_xx0eTRmsSwzsXFUVUwilhtOYqJfBJhqQH_5Wt9NH0/"
                rel="noreferrer"
              >
                Apply here.
              </a>
            </span>
          </p>
          <DaoSelectBox
            selectedDao={selectedDao}
            setSelectedDao={setSelectedDao}
            daoSelectorIsReady={daoSelectorIsReady}
            daoSelectorOptions={daoSelectorOptions}
          />
        </div>

        {/* Table --- START */}
        {jobs.length > 0 && (
          <>
            <div className="flex flex-col mt-sm">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200 table-auto">
                      <thead className="bg-slate-200">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                          >
                            Lead
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                          >
                            Visibility
                          </th>

                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Details</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {jobs.map((job) => (
                          <tr key={job.job_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                              {job.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {job.lead_contributor
                                ? truncateAddress(job.lead_contributor)
                                : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {job.status ? job.status : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {job.isPublic ? 'Public' : 'Internal'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                href={`job/${job.job_id}`}
                                className="text-slate-600 hover:text-slate-900"
                              >
                                Details
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Table --- END */}
      </div>
    </>
  )
}

Dashboard.Layout = BaseLayout

export const getStaticProps = async () => {
  const { data: daos } = await supabase
    .from('daos')
    .select('dao_id, name, logo_url, contract_address')

  return { props: { daos } }
}
