import { useAccount, useAccountConnect } from '@contexts/AccountContext'
import { truncateAddress } from '@utils/truncateAddress'

export function Header() {
  const { currentAccount, ensName } = useAccount()
  const connectWallet = useAccountConnect()
  console.log({ currentAccount, ensName })

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
