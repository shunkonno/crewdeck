import { Fragment } from 'react'

// Components
import { Popover, Transition } from '@headlessui/react'

export function BountyFilterPopover({
  RefinementList,
  selectedDaoFilters,
  selectedTagFilters,
  modalIsOpen,
  setIsOpen
}) {
  return (
    <>
      {/* Filter SP - START */}
      <div className="block sm:hidden">
        <div className="mt-1 flex gap-2 w-full">
          {/* SearchBar -- START */}
          {/*
            <div className="relative rounded-md shadow-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="focus:text-primary text-slate-400 w-6 h-6" />
            </div>
              <input
              className="focus:outline-none focus:ring-primary focus:border-primary block w-full pl-10 py-2 sm:text-sm border border-slate-300 rounded-md"
              placeholder="Search"
              />
            </div>
          */}
          {/* SearchBar -- END */}
          <Popover className="relative flex-shrink-0">
            <Popover.Button>
              <div
                className="bg-white rounded-md shadow-sm px-3 py-1 flex justify-center items-center text-slate-600 border border-slate-300"
                onClick={() => {
                  setIsOpen(!modalIsOpen)
                }}
              >
                {/* <AdjustmentsIcon className="h-6 w-6 focus:text-primary text-slate-400" /> */}
                {modalIsOpen ? 'Close' : 'Filter'}
              </div>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              show={modalIsOpen}
              unmount={false}
            >
              <Popover.Panel
                className="absolute z-10 w-screen right-0 -mr-xs mt-3 sm:px-0 lg:max-w-3xl"
                focus={true}
              >
                <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
                  <div className="p-sm">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        DAO
                      </label>
                      <div>
                        <RefinementList
                          attribute="dao"
                          searchable
                          translations={{ placeholder: 'Type to filter DAO' }}
                          defaultRefinement={selectedDaoFilters}
                        />
                      </div>
                    </div>
                    <div className="mt-sm">
                      <label className="block text-sm font-medium text-slate-700">
                        Tags
                      </label>
                      <div className="mt-2">
                        <RefinementList
                          attribute="tags"
                          defaultRefinement={selectedTagFilters}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      </div>
      {/* Filter SP - END */}
    </>
  )
}
