import Link from 'next/link'

// Assets
import { ChevronDownIcon, DocumentTextIcon, PlusSmIcon } from '@heroicons/react/solid'

// Components
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'


// Contexts
import { useAccount, useAccountConnect } from '@contexts/AccountContext'
import { truncateAddress } from '@utils/truncateAddress'

function MyLink(props) {
  let { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}

export function Header() {
  const { currentAccount, ensName } = useAccount()
  const connectWallet = useAccountConnect()
  console.log({ currentAccount, ensName })

  return (
    <header  className="relative z-50">
      <div className="py-xs px-xs">
        <div className="flex justify-between items-center">
          {/* Logo - START */}
          <Link href="/"><a>
          <div>Logo</div>
          </a></Link>
          {/* Logo - END */}
          {/* Connect Wallet - START */}
          <div>
            {/* If wallet is connected, display users' public address or ENS address. */}
            {currentAccount && (
              <div>
                <div>
                  {
                    <div className="text-right">
                    <Menu as="div" className="relative inline-block text-left bg-white">
                      <div>
                        <Menu.Button className="inline-flex justify-center w-full pl-4 pr-3 py-2 text-sm font-medium text-white border shadow-md border-slate-300 rounded-lg bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                          <span className="inline-flex items-center text-sm font-medium text-slate-800">
                            {ensName ? ensName : truncateAddress(currentAccount)}
                            <ChevronDownIcon className="w-6 h-6 ml-2 text-slate-600" />
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-slate-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="p-2">
                            <Menu.Item>
                              {
                                <MyLink href="/jobs/post"><a>
                                <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                                    <DocumentTextIcon className="w-5 h-5 mr-2 " />
                                    <span>Post Job</span>
                                </div>
                                </a></MyLink>
                              }
                            </Menu.Item>
                          </div>
                          <div className="p-2">
                            <Menu.Item>
                              {
                                <MyLink href="/register-nft"><a>
                                <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                                    <PlusSmIcon className="w-5 h-5 mr-2" />
                                    <span>Register NFT</span>
                                </div>
                                </a></MyLink>
                              }
                            </Menu.Item>
                          </div>
                          
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  }
                </div>
              </div>
            )}
            {/* If wallet isn't connected, display button to connect wallet. */}
            {!currentAccount && (
              <button
                className="bg-primary text-white px-4 py-2 text-sm font-bold rounded-lg shadow-md shadow-primary-default/50"
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
