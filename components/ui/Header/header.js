import { Fragment, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

// Assets
import { ChevronDownIcon, DocumentTextIcon, PlusSmIcon, MenuIcon, XIcon } from '@heroicons/react/solid'

// Components
import { Menu, Dialog, Transition } from '@headlessui/react'

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
  const { connectWallet } = useAccountConnect()
  console.log({ currentAccount, ensName })

  
  const router = useRouter()

  // Dialog Toggle
  let [isOpen, setIsOpen] = useState(false)

  // handle Routing
  const handleRouting = (path) => {
    setIsOpen(false)
    router.push(path)
  }

  return (
    <header  className="relative z-50">
      <div className="py-xs px-xs">
        <div className="flex items-center">
          
          {/* FlexContentLeft - START */}
          {/* Logo - START */}
          <div className=''>
            <Link href="/"><a>
              <div>Logo</div>
            </a></Link>
          </div>
          {/* Logo - END */}
          {/* FlexContentLeft - END */}
          
          {/* FlexContentRight - START */}
          {/* SP Content - START */}
          <div className="block md:hidden ml-auto">
            <div onClick={()=> setIsOpen(true)}>
              <MenuIcon className="h-6 w-6 text-slate-800" />
            </div>
            <Dialog 
              as="div"
              open={isOpen}
              className="fixed z-50 inset-0 overflow-y-auto md:hidden"
              onClose={() => setIsOpen(false)}
            >
              
              <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
              
              <div className="relative min-h-screen float-right bg-white w-64 max-w-[calc(100%-3rem)] p-sm divide-y divide-slate-200">
                <div className='pb-xs'>
                  <div className="flex">
                    <h1 className='text-slate-600 font-semibold'>Navigation</h1>
                    <XIcon 
                      className="h-6 w-6 ml-auto" 
                      onClick={()=> setIsOpen(false)}
                    />
                  </div>
                  <div className='pl-sm py-2 mt-2 rounded-lg hover:bg-slate-100'>
                    <a onClick={() => handleRouting("/browse")}>
                      <span className="outline-none">Browse</span>
                    </a>
                  </div>
                </div>
                <div className="pt-xs">
                  <h1 className='text-slate-600 font-semibold'>Account</h1>
                  {currentAccount ?
                  <>
                    <div className="mt-2 inline-flex justify-center w-full pl-4 pr-3 py-2 text-sm font-medium text-white border border-slate-300 rounded-lg bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <span className="inline-flex items-center text-sm font-medium text-slate-800">
                        {ensName ? ensName : truncateAddress(currentAccount)}
                    </span>
                    </div>
                    <div className="pt-2">
                      <div>
                        {
                          <a onClick={()=> handleRouting("/jobs/post")}>
                            <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                                <DocumentTextIcon className="w-5 h-5 mr-2 " />
                                <span>Post Job</span>
                            </div>
                          </a>
                        }
                      </div>
                    </div>
                    <div className="pt-2">
                      <div>
                        {
                          <a onClick={()=> handleRouting("/register-nft")}>
                            <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                                <PlusSmIcon className="w-5 h-5 mr-2" />
                                <span>Register NFT</span>
                            </div>
                          </a>
                        }
                      </div>
                    </div>
                  </>
                  :
                  <div className='flex justify-center mt-xs'>
                    <button
                      className="bg-primary text-white px-4 py-2 text-sm font-bold rounded-lg shadow-md shadow-primary-default/50"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </button>
                  </div>
                }
                </div>
              </div>
              
            </Dialog>
          </div>
          {/* SP Content - END */}
          {/* PC Content - START */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {/* Navigation - START */}
            <div className="flex items-center space-x-8">
              <Link href="/browse"><a>
                Browse
              </a></Link>
            </div>
            {/* Navigation - END */}
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
                                  <MyLink href="/jobs/post">
                                  <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                                      <DocumentTextIcon className="w-5 h-5 mr-2 " />
                                      <span>Post Job</span>
                                  </div>
                                  </MyLink>
                                }
                              </Menu.Item>
                            </div>
                            <div className="p-2">
                              <Menu.Item>
                                {
                                  <MyLink href="/register-nft">
                                  <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                                      <PlusSmIcon className="w-5 h-5 mr-2" />
                                      <span>Register NFT</span>
                                  </div>
                                </MyLink>
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
          {/* PC Content - END*/}
          {/* FlexContentRight - END */}
        </div>
      </div>
    </header>
  )
}
