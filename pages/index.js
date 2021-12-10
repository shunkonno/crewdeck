import Link from 'next/link'
import useSWR from 'swr'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'

export default function Home() {
  // 検証のため、index.js に仮置き **********
  // 実際には AccountContext と コントラクトアドレスを変数化して渡す
  const fetcher = (...args) => fetch(...args).then((res) => res.json())

  // Get token balance for a user's address to validate user's membership in a DAO.
  // @params {string} user - The public address of the user.
  // @params {string} contract - The contract address of the NFT for a DAO.
  // @returns {object} tokenBalance - Returns either the balance or an error.
  const { data: tokenBalance } = useSWR(
    `/api/alchemy/ethereum/mainnet/getTokenBalances/?user=${'0x940D64638D419675cED0359cc025e3C90Dbe98B2'}&contract=${'0x633cfA9ac099D18C1B33736892427f0a7c1d120a'}`,
    fetcher
  )

  const balanceValue = tokenBalance?.tokenBalance
  const error = tokenBalance?.error

  console.log({ balanceValue, error })
  // *************************************

  return (
    <>
      <SEO
       title="Crewdeck"
       description="Crewdeck's Top Page"
      />
      {/* Grid - START */}
      <div className="grid grid-cols-5 gap-4">
        {/* Filter - START */}
        <div className="container-filter col-span-1">Filters</div>
        {/* Filter - END */}
        {/* Filter Results - START */}
        <main className="container-result col-span-3">
          {/* Result - START */}
          <div className="w-full border border-slate-200 rounded-sm shadow-sm">
            <div className="px-4 py-2">
              <div className="result-title">
                <Link href="#">
                  <a>
                    <h2 className="text-lg font-medium">
                      Looking for a graphics desginer for our new NFT
                    </h2>
                  </a>
                </Link>
              </div>
              <div className="result-org">
                <h3 className="text-sm">buildspace</h3>
              </div>
              <div className="mt-3">
                <div className="result-tag">
                  <div className="flex justify-start gap-1">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        Badge
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        Badge
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Result - END */}
        </main>
        {/* Filter Results - END */}
        {/* Sidebar - START */}
        <div className="container-result col-span-1">Sidebar</div>
        {/* Sidebar - END */}
      </div>
      {/* Grid - END */}
    </>
  )
}

Home.Layout = BaseLayout