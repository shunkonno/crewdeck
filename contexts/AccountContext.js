import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const AccountContext = React.createContext()
const AccountConnectContext = React.createContext()

// Call this function to use account info.
export function useAccount() {
  return useContext(AccountContext)
}

// Call this function to use connectWallet() function.
export function useAccountConnect() {
  return useContext(AccountConnectContext)
}

export function AccountProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState('')
  const [ensName, setEnsName] = useState('')
  const [ethersProvider, setEthersProvider] = useState()

  const setAccountListener = (provider) => {
    // subscribe to provider events compatible with EIP-1193 standard. (web3.js. not ethers)
    provider.on('accountsChanged', (_) => window.location.reload())
    provider.on('chainChanged', (_) => window.location.reload())
  }

  async function connectWallet() {
    // Initialize Web3Modal.
    // https://github.com/Web3Modal/web3modal

    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions: {}
    })

    // Get provider.
    const web3Provider = await web3Modal.connect()
    // Wrap web3.js based provider to use with ethers.js.
    const provider = new ethers.providers.Web3Provider(web3Provider)
    // Set provider in state to access from other components.
    setEthersProvider(provider)
    // Get accounts.
    const accounts = await provider.listAccounts()
    const address = accounts[0]
    // Set address in state.
    setCurrentAccount(address)
    // Lookup ENS.
    const ensName = await provider.lookupAddress(address)
    // Set ENS in state, ignore if ensName is null.
    ensName ? setEnsName(ensName) : null

    return web3Provider
  }

  useEffect(() => {
    connectWallet().then((web3Provider) => {
      setAccountListener(web3Provider)
    })
  }, [])

  return (
    <AccountContext.Provider
      value={{ currentAccount, ensName, ethersProvider }}
    >
      <AccountConnectContext.Provider value={connectWallet}>
        {children}
      </AccountConnectContext.Provider>
    </AccountContext.Provider>
  )
}
