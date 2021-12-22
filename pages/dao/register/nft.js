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

// Supabase
import { supabase } from '@libs/supabase'

export default function RegisterNFT({ daos, networks }) {
  const { currentAccount, ethersProvider } = useAccount()
  const router = useRouter()

  // **************************************************
  // FORM SETTINGS
  // **************************************************

  const [daoSelectorOptions, setDaoSelectorOptions] = useState([])
  const [isReadyDaoOptions, setIsReadyDaoOptions] = useState(false)
  const networkSelectorOptions = networks

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  console.log('react-hook-form Errors', errors)

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
    //////////  ↓↓↓↓↓↓↓↓フォームに入力されているデータ↓↓↓↓↓↓↓↓//////////
    console.log('SubmitData', data)
    //////////  ↑↑↑↑↑↑↑↑フォームに入力されているデータ↑↑↑↑↑↑↑↑//////////

    const { selectedDao, selectedNetwork, nftContractAddress } = data

    // Verify users' address.
    const isVerified = await verifyAddressOwnership()

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
                      <p className="text-red-400 text-sm">
                        Daoを選択してください。
                      </p>
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
                      <p className="text-red-400 text-sm">
                        Networkを選択してください。
                      </p>
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
                    <p className="text-red-400 text-sm">入力必須です。</p>
                  )}
                  {(errors.nftContractAddress?.type === 'minLength' ||
                    errors.nftContractAddress?.type === 'maxLength') && (
                    <p className="text-red-400 text-sm">
                      0xから始まる42文字のコントラクトアドレスである必要があります。
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
