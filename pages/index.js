import React, { useCallback, useEffect, useState } from 'react'

// Assets
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/solid'

// Contexts
import { useAccount } from '@contexts/AccountContext'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'

// Supabase
import { supabase } from '@libs/supabase'

export default function Home({ daos }) {
  const { currentAccount } = useAccount()
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])

  console.log(daoSelectorOptions)

  async function getTokenBalances(eoaAddress, contractAddress) {
    const response = await fetch(
      `/api/alchemy/ethereum/mainnet/getTokenBalances/?user=${eoaAddress}&contract=${contractAddress}`
    )

    const data = await response.json()

    return data
  }

  // Filter the list of DAOs from DB, and filter the ones that the user owns tokens for. Set filtered array to state.
  // @params {array} daoList - The initial list of all DAOs.
   const filterDaoSelectorOptions = useCallback(async(daoList) => {
    //Filter DAO Function
    const filterResult = await daoList.reduce(async(promise, dao) => {
      let accumulator = []
      accumulator = await promise
      const data = await getTokenBalances(currentAccount, dao.contract_address)

      // Get substring of tokenBalance. (e.g. 0x0000000000000000000000000000000000000000000000000000000000000001)
      // If tokenBalance is greater than 0, the user owns at least one token.
      if(Number(data.tokenBalance?.substring(2)) > 0){
        await accumulator.push(dao)
      }
      return accumulator
    }, [])
    
    await setDaoSelectorOptions(filterResult)

  },[currentAccount])

  useEffect(() => {
    console.log('useEffect')
    if (currentAccount) {
      filterDaoSelectorOptions(daos)
    }
  }, [currentAccount, daos, filterDaoSelectorOptions])


  const tags = [
    { id: '1', name: 'non-technical' },
    { id: '2', name: 'graphics' },
    { id: '3', name: 'NFT' }
  ]

  return (
    <>
      <SEO title="Crewdeck" description="Crewdeck's Top Page" />
      {/* Grid - START */}
      <div className="py-xs sm:py-md block max-w-7xl mx-auto">
        {/* TopContainer - START */}
        <div className="max-w-4xl mx-sm sm:mx-auto flex flex-col items-center">
          <div className="mt-0 mb-sm sm:my-lg">
            <p className="text-3xl font-bold leading-normal">
              <span className="block sm:inline">Let’s make 2022 </span>
              <span>the year to begin contributing.</span>
            </p>
          </div>
          {/* SearchBar - START */}
          <div className="relative w-full rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="focus:text-primary text-slate-400 w-6 h-6" />
            </div>
            <input
              className="focus:outline-none focus:ring-primary focus:border-primary block w-full pl-10 py-2 sm:text-sm border border-slate-300 rounded-md"
              placeholder="Search"
            />
          </div>
          {/* SearchBar - END */}
          {/* Tags - START */}
          <div className="inline-flex w-full py-md">
            {tags.map((tag) => (
              <div key={tag.id}>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-slate-200 text-slate-800 mr-4">
                  {tag.name}
                </span>
              </div>
            ))}
          </div>
          {/* Tags - END */}
        </div>
        {/* TopContainer - END */}
        <div className="py-sm mx-sm">
          <h1 className="text-2xl">Your Joining DAO</h1>
            {daoSelectorOptions.length ?
            <div className="flex mt-sm">
            {daoSelectorOptions.map(dao => (
              <div key={dao.id} className="inline-flex shadow-md border border-slate-300 cursor-pointer py-2 px-4 rounded-lg">
                <img src={dao.logo_url} alt="" className="block h-6 w-6 mr-3" />
                <p>{dao.name}</p>
              </div>
            ))
            }
            </div>
            :
            <div className="flex justify-center mt-sm">
              <p>you are not joining dao.</p>
            </div>
            }
        </div>
      </div>
      {/* Grid - END */}
    </>
  )
}

Home.Layout = BaseLayout

export const getStaticProps = async () => {
  const { data: daos } = await supabase
    .from('daos')
    .select('id, name, logo_url, contract_address')

  return { props: { daos } }
}