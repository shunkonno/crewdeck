import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

// Functions
import { truncateAddress } from '@utils/truncateAddress'
import { AccountProvider } from '@libs/accountProvider'

// Components
import { Menu, Dialog, Transition } from '@headlessui/react'

// Assets
import {
  ChevronDownIcon,
  DocumentTextIcon,
  PlusSmIcon,
  MenuIcon,
  XIcon
} from '@heroicons/react/solid'
import classNames from 'classnames'

export function Header() {
  // ****************************************
  // ACCOUNT
  // ****************************************

  const accountProvider = AccountProvider()
  const { currentAccount, ensName } = accountProvider
  const { connectWallet } = accountProvider

  // ****************************************
  // ROUTER
  // ****************************************

  const router = useRouter()

  // handle Routing
  const handleRouting = (path) => {
    setIsOpen(false)
    router.push(path)
  }

  // ****************************************
  // UI CONTROL STATE
  // ****************************************

  // Dialog Toggle
  let [isOpen, setIsOpen] = useState(false)

  // Header BackgroundColor
  const [backgroundColor, setBackgroundColor] = useState('')

  // トップページではヘッダーの背景色を変更
  useEffect(() => {
    if (router.pathname == '/') {
      setBackgroundColor('bg-white')
    } else {
      setBackgroundColor('bg-white')
    }
  }, [router.pathname])

  // ****************************************
  // COMPONENTS
  // ****************************************

  function NavLinks(props) {
    let { href, children, ...rest } = props

    return (
      <Link href={href}>
        <a {...rest}>{children}</a>
      </Link>
    )
  }

  // ****************************************
  // RETURN
  // ****************************************

  return (
    <>
      <header
        className={`fixed z-50 h-[64px] w-full shadow-sm ${backgroundColor}`}
      >
        <div className="py-2xs px-xs h-full">
          <div className="flex items-center h-full">
            {/* FlexContentLeft - START */}
            {/* Logo - START */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="block w-28 h-8 relative">
                  <Image
                    src={'/images/logos/CrewdeckLogo.svg'}
                    layout={'fill'}
                    alt="Crewdeck Logo"
                  />
                </a>
              </Link>
              <div className="text-primary ml-2">beta</div>
            </div>
            {/* Logo - END */}
            {/* FlexContentLeft - END */}

            {/* FlexContentRight - START */}
            {/* SP Content - START */}
            <div className="block md:hidden ml-auto">
              <div onClick={() => setIsOpen(true)}>
                <MenuIcon className="h-6 w-6 text-slate-800" />
              </div>
              <Dialog
                as="div"
                open={isOpen}
                className="fixed z-50 inset-0 overflow-y-auto md:hidden"
                onClose={() => setIsOpen(false)}
              >
                <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

                <div className="relative min-h-screen float-right bg-white w-64 max-w-[calc(100%-3rem)] p-sm">
                  <div className="pb-xs border-b border-slate-200">
                    <div className="flex">
                      <h1 className="text-slate-600 font-semibold">
                        Navigation
                      </h1>
                      <XIcon
                        className="h-6 w-6 ml-auto"
                        onClick={() => setIsOpen(false)}
                      />
                    </div>
                    <div className="py-2 mt-2 active:bg-slate-100">
                      <a onClick={() => handleRouting('/dashboard')}>
                        <span className="outline-none">Your DAOs</span>
                      </a>
                    </div>
                    <div className="py-2 active:bg-slate-100">
                      <a onClick={() => handleRouting('/browse')}>
                        <span className="outline-none">Public Bounties</span>
                      </a>
                    </div>
                    <div className="py-2 active:bg-slate-100">
                      <a onClick={() => handleRouting('/job/post')}>
                        <span className="outline-none text-primary">
                          Post Bounty
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="pt-xs">
                    <h1 className="text-slate-600 font-semibold">Account</h1>
                    {currentAccount ? (
                      <>
                        <div className="mt-2 inline-flex justify-center w-full pl-4 pr-3 py-2 text-sm font-medium text-white border border-slate-300 rounded-lg bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                          <span className="inline-flex items-center text-sm font-medium text-slate-800">
                            {ensName
                              ? ensName
                              : truncateAddress(currentAccount)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center mt-xs">
                        <button
                          className="bg-primary text-white outline-none px-4 py-2 text-sm font-bold rounded-lg shadow-md shadow-primary-default/50"
                          onClick={connectWallet}
                        >
                          Connect Wallet
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="pt-xs">
                    <h3 className="text-slate-600 text-md">Social</h3>
                    <div className="inline-flex mt-xs">
                      <a
                        href="https://twitter.com/crewdeck_"
                        className="outline-none"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="text-slate-400"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog>
            </div>
            {/* SP Content - END */}

            {/* PC Content - START */}
            <div className="hidden md:flex items-center ml-auto">
              <div className="">
                {/* Twitter Link - START */}
                <a
                  href="https://twitter.com/crewdeck_"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="text-slate-400"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                {/* Twitter Link - END */}
              </div>
              {/* Navigation - START */}
              <div className="flex items-center space-x-8 ml-4 pl-4 border-l border-slate-200">
                <Link href="/dashboard">
                  <a>Your DAOs</a>
                </Link>
                <Link href="/browse">
                  <a>Public Bounties</a>
                </Link>
                <Link href="/job/post">
                  <a className="font-medium text-primary">Post Bounty</a>
                </Link>
              </div>
              {/* Navigation - END */}
              {/* Connect Wallet - START */}
              <div className="ml-4 pl-4">
                {/* If wallet is connected, display users' public address or ENS address. */}
                {currentAccount && (
                  <div>
                    <div className="px-4 py-1 rounded-full bg-white border border-slate-300">
                      <span className="text-sm font-medium text-slate-800">
                        {ensName ? ensName : truncateAddress(currentAccount)}
                      </span>
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
      {/* fixed でずれるヘッダーの高さ分、高さを補う。トップページの場合、背景色を変更する。 */}
      <div
        className={classNames(`${backgroundColor}`, 'h-[64px] w-full')}
      ></div>
    </>
  )
}

/* <Menu
  as="div"
  className="relative inline-block text-left bg-white"
>
  <div>
    <Menu.Button className="inline-flex justify-center w-full pl-4 pr-3 py-2 text-sm font-medium text-white border shadow-md border-slate-300 rounded-lg bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
      <span className="inline-flex items-center text-sm font-medium text-slate-800">
        {ensName
          ? ensName
          : truncateAddress(currentAccount)}
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
            <NavLinks href="/job/post">
              <div className="inline-flex hover:bg-slate-100 text-slate-800 w-full text-center p-2 text-sm rounded-lg">
                <DocumentTextIcon className="w-5 h-5 mr-2 " />
                <span>Post Bounty</span>
              </div>
            </NavLinks>
          }
        </Menu.Item>
      </div>
      <div className="p-2">
        <Menu.Item>
          {
            <MyLink href="/dao/register/nft">
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
</Menu> */
