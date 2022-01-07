import React, { useCallback, useEffect, useState } from 'react'

// Assets
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/solid'

// Contexts
import { useAccount } from '@contexts/AccountContext'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
import { JoinedDaosListSection } from '@components/ui/Section'

// Supabase
import { supabase } from '@libs/supabase'
import Link from 'next/link'

export default function Home({ daos, tags }) {
  // const { currentAccount } = useAccount()
  // const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  // const [isReadyDaoOptions, setIsReadyDaoOptions] = useState(false)

  // async function getTokenBalances(eoaAddress, contractAddress) {
  //   const response = await fetch(
  //     `/api/alchemy/ethereum/mainnet/getTokenBalances/?user=${eoaAddress}&contract=${contractAddress}`
  //   )

  //   const data = await response.json()

  //   return data
  // }

  // Filter the list of DAOs from DB, and filter the ones that the user owns tokens for. Set filtered array to state.
  // @params {array} daoList - The initial list of all DAOs.
  // const filterDaoSelectorOptions = useCallback(
  //   async (daoList) => {
  //     //Filter DAO Function
  //     const filterResult = await daoList.reduce(async (promise, dao) => {
  //       let accumulator = []
  //       accumulator = await promise
  //       const data = await getTokenBalances(
  //         currentAccount,
  //         dao.contract_address
  //       )

  //       // Get substring of tokenBalance. (e.g. 0x0000000000000000000000000000000000000000000000000000000000000001)
  //       // If tokenBalance is greater than 0, the user owns at least one token.
  //       if (Number(data.tokenBalance?.substring(2)) > 0) {
  //         await accumulator.push(dao)
  //       }
  //       return accumulator
  //     }, [])

  //     await setDaoSelectorOptions(filterResult)
  //   },
  //   [currentAccount]
  // )

  // useEffect(async () => {
  //   console.log('useEffect')
  //   if (currentAccount) {
  //     await filterDaoSelectorOptions(daos)
  //     await setIsReadyDaoOptions(true)
  //   }
  // }, [currentAccount, daos, filterDaoSelectorOptions])

  return (
    <>
      <MetaTags title="Crewdeck" description="Crewdeck's Top Page" />
      {/* Grid - START */}
      <div className="py-xs sm:py-md block max-w-7xl mx-auto">
        {/* TopContainer - START */}
        <div className="max-w-4xl mx-sm lg:mx-auto flex flex-col items-center">
          <div className="mt-0 mb-sm sm:my-lg">
            <p className="text-3xl font-bold leading-normal">
              <span className="block sm:inline">Find your place in a DAO.</span>
            </p>
          </div>
          {/* Tags - START */}
          <div className="inline-flex flex-wrap w-full pb-md sm:py-md gap-4 justify-center">
            {tags.map((tag) => (
              <div key={tag.tag_id}>
                <span
                  className="inline-block items-center px-2 py-0.5 rounded text-sm font-medium text-slate-800"
                  style={{ backgroundColor: tag.color_code }}
                >
                  {tag.name}
                </span>
              </div>
            ))}
          </div>
          {/* Tags - END */}
        </div>
        {/* TopContainer - END */}

        {/* Joined DAOs - START */}
        {/* <JoinedDaosListSection
          currentAccount={currentAccount}
          daoSelectorOptions={daoSelectorOptions}
          isReadyDaoOptions={isReadyDaoOptions}
        /> */}
        {/* Joined DAOs - END */}

        {/* LP Content - START */}
        <div>
          <div className='px-sm'>
            <h1 className="text-xl  flex justify-center">
              Crewdeck is dedicated to gated DAOs that have NFTs associated with
              membership.
            </h1>
            <p className="text-xl flex justify-center">
              Post a job, or browse how you can contribute to an existing DAO.
            </p>
          </div>
          <div className="mt-sm">
            <Link href="/browse">
              <a className="text-lg font-medium text-blue-500 flex justify-center">
                &#128073; &nbsp; Start Browsing
              </a>
            </Link>
          </div>
        </div>
        {/* LP Content - END */}
      </div>
      {/* Grid - END */}
    </>
  )
}

Home.Layout = BaseLayout

export const getStaticProps = async () => {
  // Get all tags.
  const { data: tags } = await supabase
    .from('tags')
    .select('tag_id, name, color_code')

  const { data: daos } = await supabase
    .from('daos')
    .select('dao_id, name, logo_url, contract_address')

  return { props: { daos, tags } }
}
