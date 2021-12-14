import React, { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ethers } from 'ethers'

// Assets
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'

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

// Quill Editor - Dynamic import to prevent SSR
// https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function PostJob({ daos }) {
  const { currentAccount, ethersProvider } = useAccount()

  // **************************************************
  // VALUES TO SUBMIT TO SERVER
  // **************************************************
  const [title, setTitle] = useState('')
  const [selectedDao, setSelectedDao] = useState(null)
  const [editorContent, setEditorContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  console.log({ daos })
  // console.log({ selectedDao })

  // **************************************************
  // FORM SETTINGS
  // **************************************************

  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  console.log({ daoSelectorOptions })

  const publicSettings = [
    {
      id: 'public',
      name: 'Public',
      description: 'Your post will show up on search results.'
    },
    {
      id: 'private',
      name: 'Private',
      description:
        'Access only if the person knows the URL. Your post will not show up on search results.'
    }
  ]

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote']
    ]
  }

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
  function filterDaoSelectorOptions(daoList) {
    let filterResult = []

    daoList.map(async (dao) => {
      const data = await getTokenBalances(currentAccount, dao.contract_address)

      // Get substring of tokenBalance. (e.g. 0x0000000000000000000000000000000000000000000000000000000000000001)
      // If tokenBalance is greater than 0, the user owns at least one token.
      if (Number(data.tokenBalance?.substring(2)) > 0) {
        filterResult.push(dao)
      }
    })

    setDaoSelectorOptions(filterResult)
  }

  useEffect(() => {
    console.log('useEffect')
    if (currentAccount) {
      filterDaoSelectorOptions(daos)
    }
  }, [currentAccount, daos])

  // **************************************************
  // HANDLE DATA SUBMIT
  // **************************************************

  // Saves data to DB.
  async function saveToDB() {
    const { data, error } = await supabase.from('jobs').insert([
      {
        title: title,
        description: editorContent,
        dao_id: selectedDao.id,
        is_public: isPublic
      }
    ])

    if (error) {
      console.log(error)
    }
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

  // Handles data submit.
  async function handleSubmit(event) {
    event.preventDefault()

    // Verify users' address.
    const isVerified = await verifyAddressOwnership()

    // Exit process if the users' address can't be verified.
    if (!isVerified) {
      return
    }

    // Save data to DB.
    await saveToDB()

    console.log('Successfully saved to DB.')

    // TODO: Redirect user to the newly created job post.
  }

  return (
    <>
      <SEO title="Post Job" description="Post Job" />

      <div className="py-md max-w-4xl mx-auto px-4 sm:px-0">
        {/* Form - START */}
        <form
          className="space-y-8 divide-y divide-slate-200"
          onSubmit={handleSubmit}
        >
          <div className="space-y-8 divide-y divide-slate-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-slate-900">
                  Write Job Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
                {!daoSelectorOptions.length &&
                  <p className="mt-1 text-sm text-red-500">
                    {`You don't have any NFT assigned by DAO. You cannot post jobs. `}
                  </p>
                }
                
              </div>

              <div>
                {/* Title - START */}
                <div className="mt-sm">
                  <label className="block font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 text-xl py-1 shadow-sm border focus:outline-none focus:border-primary px-2 block w-full rounded-md border-slate-300"
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                  />
                </div>
                {/* Title - END */}

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
                              daoSelectorOptions.length ?
                              "cursor-default focus:border-primary"
                              :
                              "cursor-not-allowed bg-slate-200",
                              "relative w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm"
                            )}
                            
                          >
                            <span className="flex items-center">
                              {daoSelectorOptions.length ?
                                selectedDao === null ? (
                                  <span className="block truncate text-black">
                                    {'select your dao'}
                                  </span>
                                ) : (
                                  <>
                                    <img
                                      src={
                                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                      }
                                      alt=""
                                      className="flex-shrink-0 h-6 w-6 rounded-full"
                                    />
                                    <span className="ml-3 block truncate text-black">
                                      {selectedDao.name}
                                    </span>
                                  </>
                                )
                              :
                              <span className="block truncate text-slate-600">
                                {`no DAO options`}
                              </span>
                            }
                            </span>
                            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-slate-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          
                          {daoSelectorOptions.length ?
                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {daos.map((dao) => (
                                <Listbox.Option
                                  key={dao.id}
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
                                        <img
                                          src={
                                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                          }
                                          alt=""
                                          className="flex-shrink-0 h-6 w-6 rounded-full"
                                        />
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
                          :
                          <>
                          </>
                          }
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                {/* DAO Selector - END */}

                {/* Editor - START */}
                <div className="mt-sm">
                  <label className="block font-medium text-slate-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <ReactQuill
                      theme="snow"
                      modules={quillModules}
                      value={editorContent}
                      onChange={setEditorContent}
                    />
                  </div>
                </div>
                {/* Editor - END */}

                {/* Public Settings - START */}
                <div className="mt-sm">
                  <fieldset>
                    <legend className="sr-only">Public Settings</legend>
                    <label className="block font-medium text-slate-700">
                      Public Settings
                    </label>
                    <div className="mt-xs space-y-5">
                      {publicSettings.map((publicSetting) => (
                        <div
                          key={publicSetting.id}
                          className="relative flex items-start"
                        >
                          <div className="flex items-center h-5">
                            <input
                              id={publicSetting.id}
                              aria-describedby={`${publicSetting.id}-description`}
                              name="publicSetting"
                              type="radio"
                              defaultChecked={publicSetting.id === 'public'}
                              className="h-4 w-4 text-primary border-slate-300"
                              onClick={() => {
                                setIsPublic(publicSetting.id === 'public')
                              }}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor={publicSetting.id}
                              className="font-medium text-slate-700"
                            >
                              {publicSetting.name}
                            </label>
                            <p
                              id={`${publicSetting.id}-description`}
                              className="text-slate-500"
                            >
                              {publicSetting.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
                {/* Public Settings - END */}
              </div>
            </div>
          </div>
          {/* Submit Button - START */}
          <div className="pt-5 flex justify-end">
            <button
              disabled={!daoSelectorOptions.length}
              className={classNames(
                daoSelectorOptions.length ?
                "bg-primary cursor-pointer"
                :
                "bg-slate-300 cursor-not-allowed",
                "py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  "
              )}
              type="submit"
            >
              Post
            </button>
          </div>
          {/* Submit Button - END */}
        </form>
        {/* Form - END */}
      </div>
    </>
  )
}

PostJob.Layout = BaseLayout

export const getStaticProps = async () => {
  const { data: daos } = await supabase
    .from('daos')
    .select('id, name, logo_url, contract_address')

  return { props: { daos } }
}
