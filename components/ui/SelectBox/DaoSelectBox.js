import React, { Fragment, useEffect, useState } from 'react'

// Assets
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'

// Components
import { Listbox, Transition } from '@headlessui/react'

// Functions
import classNames from 'classnames'

export function DaoSelectBox({
  onChange,
  selectedDao,
  setSelectedDao,
  daoSelectorOptions,
  daoSelectorIsReady
}) {
  useEffect(() => {
    setSelectedDao(selectedDao || null)
  }, [selectedDao])

  return (
    <Listbox
      value={selectedDao}
      onChange={
        onChange //onChange propsが渡されていなければ、HeadlessUIの書式に従い、setSelectedDaoのみ
          ? (e) => onChange(e)
          : setSelectedDao
      }
    >
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button
              className={classNames(
                daoSelectorOptions.length
                  ? 'cursor-default focus:border-primary'
                  : 'cursor-not-allowed bg-slate-200',
                'relative w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm'
              )}
            >
              <span className="flex items-center">
                {daoSelectorIsReady ? (
                  daoSelectorOptions.length ? (
                    selectedDao === null ? (
                      <span className="block truncate text-black">
                        {'Select Your DAO'}
                      </span>
                    ) : (
                      <>
                        {selectedDao?.logo_url && (
                          <img
                            src={selectedDao?.logo_url}
                            alt=""
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                          />
                        )}
                        <span className="ml-3 block truncate text-black">
                          {selectedDao?.name}
                        </span>
                      </>
                    )
                  ) : (
                    <span className="block truncate text-slate-600">
                      {`No DAO options`}
                    </span>
                  )
                ) : (
                  <span className="block truncate text-slate-600">
                    {`Loading...`}
                  </span>
                )}
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            {daoSelectorOptions.length ? (
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {daoSelectorOptions.map((dao) => (
                    <Listbox.Option
                      key={dao.dao_id}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-primary' : 'text-slate-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9 list-none'
                        )
                      }
                      value={dao}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            {dao.logo_url && (
                              <img
                                src={dao.logo_url}
                                alt=""
                                className="flex-shrink-0 h-6 w-6 rounded-full"
                              />
                            )}
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'ml-3 block truncate'
                              )}
                            >
                              {dao.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-primary',
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
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </Listbox>
  )
}
