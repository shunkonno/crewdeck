import React, { Fragment, useEffect, useState } from 'react'

// Assets
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'

// Components
import { Listbox, Transition } from '@headlessui/react'

// Functions
import classNames from 'classnames'


export function DaoSelectBox({onChange, selectedDao, daoSelectorOptions, isReadyDaoOptions}) {

  const [selected, setSelected] = useState(selectedDao|| null)

  useEffect(()=>{
    setSelected(selectedDao)
  },[selectedDao])

  return(
    <Listbox 
      value={selected} 
      onChange={(e) => {
          setSelected
          onChange && onChange(e);
        }
      }
    >
      {({ open }) => (
        <>
          <Listbox.Label className="block font-medium text-slate-700">
            DAO
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button
              className={classNames(
                daoSelectorOptions.length
                  ? 'cursor-default focus:border-primary'
                  : 'cursor-not-allowed bg-slate-200',
                'relative w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm'
              )}
            >
              <span className="flex items-center">
                {isReadyDaoOptions ? (
                  daoSelectorOptions.length ? (
                    selected === undefined ? (
                      <span className="block truncate text-black">
                        {'select your dao'}
                      </span>
                    ) : (
                      <>
                        {selected?.logo_url && (
                          <img
                            src={selected?.logo_url}
                            alt=""
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                          />
                        )}
                        <span className="ml-3 block truncate text-black">
                          {selected?.name}
                        </span>
                      </>
                    )
                  ) : (
                    <span className="block truncate text-slate-600">
                      {`no DAO options`}
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
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {daoSelectorOptions.map((dao) => (
                    <Listbox.Option
                      key={dao.dao_id}
                      className={({ active }) =>
                        classNames(
                          active
                            ? 'text-white bg-primary'
                            : 'text-slate-900',
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
                                selected
                                  ? 'font-semibold'
                                  : 'font-normal',
                                'ml-3 block truncate'
                              )}
                            >
                              {dao.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active
                                  ? 'text-white'
                                  : 'text-primary',
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