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

export default function Dashboard({ daos }) {
  console.log({ daos })
  const accountProvider = AccountProvider()
  const { currentAccount, ethersProvider } = accountProvider


  // Dao Options UI Control State
  const [selectedDao, setSelectedDao] = useState(null)
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [daoSelectorIsReady, setDaoSelectorIsReady] = useState(false)

  console.log(selectedDao)

  useEffect(() => {
    if (currentAccount) {
      detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions).then(() => {
        setDaoSelectorIsReady(true)
      })
    }
  }, [currentAccount, daos])

  const people = [
    {
      id: '1',
      name: 'Jane Cooper',
      title: 'Regional Paradigm Technician',
      role: 'Admin',
      email: 'jane.cooper@example.com'
    },
    {
      id: '2',
      name: 'Jane Cooper',
      title: 'Regional Paradigm Technician',
      role: 'Admin',
      email: 'jane.cooper@example.com'
    }
  ]

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <MetaTags title="Dashboard" description="Dashboard" />
      <div className='max-w-7xl mx-auto'>
        <div className="mt-sm w-2/3 sm:w-1/3">
          <DaoSelectBox 
            selectedDao={selectedDao}
            setSelectedDao={setSelectedDao}
            daoSelectorIsReady={daoSelectorIsReady}
            daoSelectorOptions={daoSelectorOptions}
          />
        </div>
        {/* Table --- START */}
        <div className="flex flex-col mt-sm">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {people.map((person) => (
                      <tr key={person.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {person.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {person.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {person.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {person.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
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
