import React, { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'

// Vercel
import { useRouter } from 'next/router'

// Contexts
import { useAccount } from '@contexts/AccountContext'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
import { DaoSelectBox } from '@components/ui/SelectBox'
import { NetworkSelectBox } from '@components/ui/SelectBox'
import { NftContractAddressInput } from '@components/ui/Input'

// Functions
import classNames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { detectJoinedDaos } from '@utils/detectJoinedDaos'
import { verifyAddressOwnership } from '@utils/verifyAddressOwnership'

// Supabase
import { supabase } from '@libs/supabase'

export default function RegisterNFT({ daos, networks }) {
  const { currentAccount, ethersProvider } = useAccount()
  const router = useRouter()

  // Dao Options UI Control State
  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [isReadyDaoOptions, setIsReadyDaoOptions] = useState(false)
  const networkSelectorOptions = networks

  // React Hook Form Settings
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  Object.keys(errors).length && console.log('react-hook-form Errors', errors)

  useEffect(async () => {
    if (currentAccount) {
      await detectJoinedDaos(daos, currentAccount, setDaoSelectorOptions)
      await setIsReadyDaoOptions(true)
    }
  }, [currentAccount, daos, detectJoinedDaos])

  // **************************************************
  // HANDLE DATA SUBMIT
  // **************************************************

  // Saves data to DB.
  async function saveToDB(selectedDao, selectedNetwork, nftContractAddress) {
    const { data, error } = await supabase
      .from('daos')
      .update({
        network_id: selectedNetwork.network_id,
        contract_address: nftContractAddress
      })
      .match({ dao_id: selectedDao.dao_id })

    if (error) {
      console.log(error)
      return false
    }

    return data
  }

  // Handles data submit via react-hook-form
  async function onSubmit(data) {
    //////////  ↓↓↓↓↓↓↓↓フォームに入力されているデータ↓↓↓↓↓↓↓↓//////////
    console.log('SubmitData', data)
    //////////  ↑↑↑↑↑↑↑↑フォームに入力されているデータ↑↑↑↑↑↑↑↑//////////

    const { selectedDao, selectedNetwork, nftContractAddress } = data

    // Verify users' address.
    const isVerified = await verifyAddressOwnership(currentAccount, ethersProvider)

    // Exit process if the users' address can't be verified.
    if (!isVerified) {
      return
    }

    // Save data to DB.
    const result = await saveToDB(
      selectedDao,
      selectedNetwork,
      nftContractAddress
    )

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
                <h1 className="text-2xl leading-6 font-medium text-slate-900">
                  Register NFT
                </h1>
                {isReadyDaoOptions && !daoSelectorOptions.length && (
                  <p className="mt-1 text-sm text-red-500">
                    {`You don't have any NFTs for a DAO. You cannot register NFT. `}
                  </p>
                )}
              </div>
              <div>
                {/* DAO Selector - START */}
                <div className="mt-sm w-2/3 sm:w-1/3">
                  <Controller
                    control={control}
                    name="selectedDao"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <DaoSelectBox
                        onChange={onChange}
                        selectedDao={value}
                        isReadyDaoOptions={isReadyDaoOptions}
                        daoSelectorOptions={daoSelectorOptions}
                      />
                    )}
                  />
                  <div className="mt-2">
                    {errors.selectedDao?.type === 'required' && (
                      <p className="text-red-400 text-sm">Select DAO.</p>
                    )}
                  </div>
                </div>
                {/* DAO Selector - END */}

                {/* Network Selector - START */}
                <div className="mt-sm w-2/3 sm:w-1/3">
                  <Controller
                    control={control}
                    name="selectedNetwork"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <NetworkSelectBox
                        onChange={onChange}
                        selectedNetwork={value}
                        networkSelectorOptions={networkSelectorOptions}
                      />
                    )}
                  />
                  <div className="mt-2">
                    {errors.selectedNetwork?.type === 'required' && (
                      <p className="text-red-400 text-sm">Select network.</p>
                    )}
                  </div>
                </div>
                {/* Network Selector - END */}

                {/* NftContractAddress - START */}
                <div className="mt-sm">
                  <label className="block font-medium text-slate-700">
                    {`NFT Contract Address`}
                  </label>
                  <Controller
                    control={control}
                    name="nftContractAddress"
                    rules={ {
                      required: true,
                      minLength: 42,
                      maxLength: 42
                    } }
                    render={({ 
                      field: { onChange, value, name } 
                    }) => (
                      <NftContractAddressInput
                        onChange={onChange}
                        nftContractAddress={value}
                        name={name}
                      />
                    )}
                  />
                </div>
                <div className="mt-2">
                  {errors.nftContractAddress?.type === 'required' && (
                    <p className="text-red-400 text-sm">
                      This input is required.
                    </p>
                  )}
                  {(errors.nftContractAddress?.type === 'minLength' ||
                    errors.nftContractAddress?.type === 'maxLength') && (
                    <p className="text-red-400 text-sm">
                      A contract address must be 42 letters starting with 0x.
                    </p>
                  )}
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
