import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

let AccountContext = React.createContext()
let AccountConnectContext = React.createContext()

// Call this function to use account info.
export function useAccount() {
  return useContext(AccountContext)
}

// Call this function to use connectWallet() function.
export function useAccountConnect() {
  return useContext(AccountConnectContext)
}

export function AccountProvider({ children }) {
  let [currentAccount, setCurrentAccount] = useState('')
  let [ensName, setEnsName] = useState('')

  async function connectWallet() {
    // Initialize Web3Modal.
    // https://github.com/Web3Modal/web3modal
    let web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {}
    })

    // Get provider.
    let web3Provider = await web3Modal.connect()
    // Wrap web3.js based provider to use with ethers.js.
    let provider = new ethers.providers.Web3Provider(web3Provider)
    // Get accounts.
    let accounts = await provider.listAccounts()
    let address = accounts[0]
    // Set address in state.
    setCurrentAccount(address)
    // Lookup ENS.
    let ensName = await provider.lookupAddress(address)
    // Set ENS in state, ignore if ensName is null.
    ensName ? setEnsName(ensName) : null
  }

  useEffect(() => {
    connectWallet()
  }, [])

  return (
    <AccountContext.Provider value={{ currentAccount, ensName }}>
      <AccountConnectContext.Provider value={connectWallet}>
        {children}
      </AccountConnectContext.Provider>
    </AccountContext.Provider>
  )
}
