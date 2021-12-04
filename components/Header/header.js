import { useAccount, useAccountConnect } from '../../contexts/AccountContext'

export function Header() {
  let { currentAccount, ensName } = useAccount()
  let connectWallet = useAccountConnect()
  console.log({ currentAccount, ensName })

  // Truncates the public address of the connected wallet.
  // @param {string} address - The public address of the wallet.
  // @returns {string} - The truncated address.
  function truncateAddress(address) {
    let firstFiveLetters = address.substring(0, 5)
    let lastFiveLetters = address.substring(address.length - 5)
    let truncatedAddress = firstFiveLetters + '...' + lastFiveLetters

    return truncatedAddress
  }

  return (
    <header>
      <div className="mb-8">
        <div className="flex justify-between">
          {/* Logo - START */}
          <div>Logo</div>
          {/* Logo - END */}
          {/* Connect Wallet - START */}
          <div>
            {/* If wallet is connected, display users' public address or ENS address. */}
            {currentAccount && (
              <div>
                <div>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {ensName ? ensName : truncateAddress(currentAccount)}
                  </span>
                </div>
              </div>
            )}
            {/* If wallet isn't connected, display button to connect wallet. */}
            {!currentAccount && (
              <button
                className="bg-blue-200 px-4 py-2 text-sm font-bold rounded-sm"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
          {/* Connect Wallet - END */}
        </div>
      </div>
    </header>
  )
}
