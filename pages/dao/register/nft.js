import React, { Fragment, useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'

// Assets
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
// Vercel
import { useRouter } from 'next/router'

// Contexts
import { useAccount } from '@contexts/AccountContext'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
import { Listbox, Transition } from '@headlessui/react'

// Functions
import classNames from 'classnames'

// Supabase
import { supabase } from '@libs/supabase'

export default function RegisterNFT({ daos, networks }) {
  const { currentAccount, ethersProvider } = useAccount()
  const router = useRouter()

  // **************************************************
  // VALUES TO SUBMIT TO SERVER
  // **************************************************
  const [nftContractAddress, setNftContractAddress] = useState('')
  const [selectedDao, setSelectedDao] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)

  console.log({ selectedDao, selectedNetwork })

  // **************************************************
  // FORM SETTINGS
  // **************************************************

  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [isReadyDaoOptions, setIsReadyDaoOptions] = useState(false)
  const networkSelectorOptions = networks

  // Get token balance for a user's address to validate user's membership in a DAO.
  // @params {string} eoaAddress - The public address of the user.
  // @params {string} contractAddress - The contract address of the NFT for a DAO.
  // @returns {object} tokenBalance - Returns either the balance or an error.
  async function getTokenBalances(eoaAddress, contractAddress) {
    const response = await fetch(
      `/api/alchemy/ethereum/mainnet/getTokenBalances/?user=${eoaAddress}&contract=${contractAddress}`
    )

    const data = await response.json()

    return data
  }

  // Filter the list of DAOs from DB, and filter the ones that the user owns tokens for. Set filtered array to state.
  // @params {array} daoList - The initial list of all DAOs.
  const filterDaoSelectorOptions = useCallback(
    async (daoList) => {
      // Filter DAO.
      const filterResult = await daoList.reduce(async (promise, dao) => {
        let accumulator = []
        accumulator = await promise
        const data = await getTokenBalances(
          currentAccount,
          dao.contract_address
        )

        // Get substring of tokenBalance. (e.g. 0x0000000000000000000000000000000000000000000000000000000000000001)
        // If tokenBalance is greater than 0, the user owns at least one token.
        if (Number(data.tokenBalance?.substring(2)) > 0) {
          await accumulator.push(dao)
        }
        return accumulator
      }, [])

      setDaoSelectorOptions(filterResult)
    },
    [currentAccount]
  )

  useEffect(async () => {
    console.log('useEffect')
    if (currentAccount) {
      await filterDaoSelectorOptions(daos)
      await setIsReadyDaoOptions(true)
    }
  }, [currentAccount, daos, filterDaoSelectorOptions])

  // **************************************************
  // HANDLE DATA SUBMIT
  // **************************************************

  // Saves data to DB.
  async function saveToDB( selectedDao, selectedNetwork) {
    console.log('selectedDao',selectedDao)
    console.log('selectedNetwork',selectedNetwork)
    const { data, error } = await supabase
      .from('daos')
      .update({
        network_id: selectedNetwork.network_id
      })
      .match({ dao_id: selectedDao.dao_id })

    if (error) {
      console.log(error)
      return false
    }

    return data
  }

  // Verifies if the user holds the private key for the public address. (EIP-191)
  // @returns {bool} isVerified - Returns whether the address has been verified.
  async function verifyAddressOwnership() {
    // Sign a message.
    const signer = ethersProvider.getSigner()
    const message =
      'Please sign this message for verification. This does not incur any gas fees.'
    const signature = await signer.signMessage(message)

    // Get public address used to sign the message.
    const address = ethers.utils.verifyMessage(message, signature)

    // If currentAccount equals address, we know that the user has the private key for the currentAccount.
    const isVerified = currentAccount === address ? true : false

    return isVerified
  }

  // Handles data submit via react-hook-form
  async function onSubmit(data) {

    console.log('SubmitData',data)

    const { selectedDao, selectedNetwork } = data

    // Verify users' address.
    const isVerified = await verifyAddressOwnership()

    // Exit process if the users' address can't be verified.
    if (!isVerified) {
      return
    }

    // Save data to DB.
    const result = await saveToDB(selectedDao, selectedNetwork)

    if (result) {
      console.log('Successfully saved to DB.')

    // Redirect user to nudge job posting.
    // TODO: Display a message telling them they can add a job now.
      router.push(`/job/post`)
    } else {
      router.push(`/`)
    }
  }

  return (
    <>
      <SEO title="Register NFT" description="Register NFT" />

      <div className="py-md max-w-4xl mx-auto px-4 lg:px-0">
        {/* Form - START */}
        <form
          className="space-y-8 divide-y divide-slate-200"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-8 divide-y divide-slate-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-slate-900">
                  Register NFT
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  hoge hoge description. hoge hoge description. hoge hoge
                  description.
                </p>
                {isReadyDaoOptions && !daoSelectorOptions.length && (
                  <p className="mt-1 text-sm text-red-500">
                    {`You don't have any NFT assigned by DAO. You cannot register NFT. `}
                  </p>
                )}
              </div>
              <div>
                {/* DAO Selector - START */}
                <div className="mt-sm w-2/3 sm:w-1/3">
                  <Listbox value={selectedDao} onChange={setSelectedDao}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block font-medium text-slate-700">
                          DAO
                        </Listbox.Label>
                        <div className="mt-1 relative">
                          <Listbox.Button
                            className={classNames(
                              daoSelectorOptions.length
                                ? 'cursor-default focus:border-primary'
                                : 'cursor-not-allowed bg-slate-200',
                              'relative w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm'
                            )}
                          >
                            <span className="flex items-center">
                              {isReadyDaoOptions ? (
                                daoSelectorOptions.length ? (
                                  selectedDao === null ? (
                                    <span className="block truncate text-black">
                                      {'select your dao'}
                                    </span>
                                  ) : (
                                    <>
                                      {selectedDao.logo_url && (
                                        <img
                                          src={selectedDao.logo_url}
                                          alt=""
                                          className="flex-shrink-0 h-6 w-6 rounded-full"
                                        />
                                      )}
                                      <span className="ml-3 block truncate text-black">
                                        {selectedDao.name}
                                      </span>
                                    </>
                                  )
                                ) : (
                                  <span className="block truncate text-slate-600">
                                    {`no DAO options`}
                                  </span>
                                )
                              ) : (
                                <span className="block truncate text-slate-600">
                                  {`Loading...`}
                                </span>
                              )}
                            </span>
                            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-slate-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          {daoSelectorOptions.length ? (
                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {daoSelectorOptions.map((dao) => (
                                  <Listbox.Option
                                    key={dao.dao_id}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? 'text-white bg-primary'
                                          : 'text-slate-900',
                                        'cursor-default select-none relative py-2 pl-3 pr-9 list-none'
                                      )
                                    }
                                    value={dao}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          {dao.logo_url && (
                                            <img
                                              src={dao.logo_url}
                                              alt=""
                                              className="flex-shrink-0 h-6 w-6 rounded-full"
                                            />
                                          )}
                                          <span
                                            className={classNames(
                                              selected
                                                ? 'font-semibold'
                                                : 'font-normal',
                                              'ml-3 block truncate'
                                            )}
                                          >
                                            {dao.name}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? 'text-white'
                                                : 'text-primary',
                                              'absolute inset-y-0 right-0 flex items-center pr-4'
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          ) : (
                            <></>
                          )}
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                {/* DAO Selector - END */}

                {/* Network Selector - START */}
                <div className="mt-sm w-2/3 sm:w-1/3">
                  <Listbox
                    value={selectedNetwork}
                    onChange={setSelectedNetwork}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block font-medium text-slate-700">
                          Network
                        </Listbox.Label>
                        <div className="mt-1 relative">
                          <Listbox.Button
                            className={
                              'cursor-default focus:border-primary relative w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm'
                            }
                          >
                            <span className="flex items-center">
                              {selectedNetwork === null ? (
                                <span className="block truncate text-black">
                                  {'select your network'}
                                </span>
                              ) : (
                                <>
                                  {selectedNetwork.logo_url && (
                                    <img
                                      src={selectedNetwork.logo_url}
                                      alt=""
                                      className="flex-shrink-0 h-6 w-6 rounded-full"
                                    />
                                  )}
                                  <span className="ml-3 block truncate text-black">
                                    {selectedNetwork.name}
                                  </span>
                                </>
                              )}
                            </span>
                            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-slate-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {networkSelectorOptions.map((network) => (
                                <Listbox.Option
                                  key={network.network_id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? 'text-white bg-primary'
                                        : 'text-slate-900',
                                      'cursor-default select-none relative py-2 pl-3 pr-9 list-none'
                                    )
                                  }
                                  value={network}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        {network.logo_url && (
                                          <img
                                            src={network.logo_url}
                                            alt=""
                                            className="flex-shrink-0 h-6 w-6 rounded-full"
                                          />
                                        )}
                                        <span
                                          className={classNames(
                                            selected
                                              ? 'font-semibold'
                                              : 'font-normal',
                                            'ml-3 block truncate'
                                          )}
                                        >
                                          {network.name}
                                        </span>
                                      </div>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? 'text-white'
                                              : 'text-primary',
                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                {/* Network Selector - END */}

                {/* NftContractAddress - START */}
                <div className="mt-sm">
                  <label className="block font-medium text-slate-700">
                    {`NFT Contract Address`}
                  </label>
                  <input
                    type="text"
                    className="mt-1 py-2 shadow-sm border focus:outline-none focus:border-primary px-2 block w-full rounded-md border-slate-300"
                    placeholder="0x..."
                    onChange={(e) => {
                      setNftContractAddress(e.target.value)
                    }}
                  />
                </div>
                {/* NftContractAddress - END */}
              </div>
            </div>
          </div>
          {/* Submit Button - START */}
          <div className="pt-5 flex justify-end">
            <button
              disabled={!daoSelectorOptions.length}
              className={classNames(
                daoSelectorOptions.length
                  ? 'bg-primary cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed',
                'py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  '
              )}
              type="submit"
            >
              Register
            </button>
          </div>
          {/* Submit Button - END */}
        </form>
        {/* Form - END */}
      </div>
    </>
  )
}

RegisterNFT.Layout = BaseLayout

export const getStaticProps = async () => {
  const { data: daos } = await supabase
    .from('daos')
    .select('dao_id, name, logo_url, contract_address')

  const { data: networks } = await supabase
    .from('networks')
    .select('network_id,name,logo_url')

  return { props: { daos, networks } }
}
