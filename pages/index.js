// Vercel
import Image from 'next/image'

// Assets

import { InformationCircleIcon } from '@heroicons/react/outline'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'
// import { JoinedDaosListSection } from '@components/ui/Section'

// Supabase
import { supabase } from '@libs/supabase'

export default function Home() {

  return (
    <>
      <MetaTags title="Crewdeck" description="Crewdeck's Top Page" />
      {/* Grid - START */}
      <div className="">
        {/* TopContainer - START */}
        <div className="bg-teal-50">
          <div className="max-w-5xl mx-sm lg:mx-auto">
            <div className="flex items-center py-md sm:py-xl">
              <div className="w-full md:w-1/2">
                <h1 className="text-4xl font-bold">
                  <p className="text-5xl leading-extra-tight lg:leading-tight">Manage Bounties</p>
                  <p className="text-5xl mb-2">
                    <span className='leading-extra-tight lg:leading-tight'>for&nbsp;</span>
                    <span className='pb-2 text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-blue-500 sm:inline-block leading-extra-tight lg:leading-tight'>
                      NFT-gated DAOs
                    </span>
                  </p>
                </h1>
                <p className='mt-sm sm:mt-xs text-slate-600'>{`Keep track of who’s working on what, and compensate fairly. Get people contributing from within the DAO, or make the bounty public.`}</p>
                <div className="flex justify-center md:justify-start">
                  <button className="mt-sm sm:mt-xs bg-primary px-xs py-2 rounded-md text-white text-xl font-medium">
                    Early Entry
                  </button>
                </div>
              </div>
              <div className="hidden md:w-1/2 md:flex justify-end">
                <div className="relative sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-2xl overflow-hidden">
                  <Image 
                    src={"/images/hero/yacht.jpg"} 
                    alt="hero-image" 
                    layout={"fill"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* TopContainer - END */}

        {/* LP Content - START */}
        <section className="bg-white px-sm py-md sm:py-xl">
          <div className='max-w-5xl mx-auto'>
            <div className='mb-4'>
              <h2 className='inline text-2xl font-semibold leading-normal'>Managing bounties on Discord is hard.&nbsp;</h2>
              <div className='relative inline-block w-6 h-6 sm:py-0'>
                <Image src={'/images/decoration/moyamoya.png'} layout="fill" alt="moyamoya" />
              </div>
            </div>
            <p className=''>Bad management of tasks leads to most people feeling unsure how to contribute. </p>
            <p className='mt-2'>Examples: </p>
            <p className=''>・Checking every Discord channel to keep track of potential opportunities </p>
            <p className=''>{`・Scrolling up & down the chat to check if a particular task is being worked on, and by whom `}</p>
            <strong className='mt-2 inline-block'>{`Use Crewdeck instead, to manage bounties and lower barriers to contributing.`}</strong>
          </div>
        </section>

        <section className="bg-white px-sm py-md sm:py-xl">
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-2xl font-semibold leading-normal mb-4'>Feature</h2>
            <div className='flex flex-col sm:flex-row gap-8'>
              <div className="w-full sm:w-1/2 bg-white border border-teal-400 rounded-lg px-md py-sm">
                <div className=''>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-2 w-full">
                    <InformationCircleIcon className="w-6 h-6 text-primary flex-shrink-0" />
                    <h3 className='text-xl font-medium text-center md:text-left'>Managing Bounties within the DAO</h3>
                  </div>
                  <p className='mt-4'>
                    {`Crewdeck is an easy way to allow NFT owners to post/manage bounties. We’re also working to bring more methods of collaboration and compensation on bounties.`}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/2 bg-white border border-teal-400 rounded-lg px-md py-sm">
                <div className=''>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-2 w-full">
                    <InformationCircleIcon className="w-6 h-6 text-primary flex-shrink-0" />
                    <h3 className='text-xl font-medium text-center md:text-left'>Post Public Bounties when Necessary</h3>
                  </div>
                  <p className='mt-4'>
                    {`Sometimes, the skillset necessary for a certain task is outside the scope of the DAO. Public bounties can be searched and acheived by anyone interested.`}
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='bg-slate-50 px-sm py-md'>
          <div className='max-w-5xl mx-auto py-0 sm:py-8 flex flex-col md:flex-row justify-between gap-6'>
            <h1 className="text-4xl font-semibold">
              <p className="text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-cyan-600 sm:inline-block">Grow your DAO&nbsp;</p>
              <p className='sm:inline-block'>with Crewdeck.</p>
            </h1>
            <div className='flex justify-center'>
              <span className="bg-primary px-xs py-2 rounded-md text-white text-xl font-medium cursor-pointer">
                Early Entry
              </span>
            </div>
          </div>
        </section>
        {/* LP Content - END */}
      </div>
      {/* Grid - END */}
    </>
  )
}

Home.Layout = BaseLayout

export const getStaticProps = async () => {
  // Get all tags.
  const { data: tags } = await supabase
    .from('tags')
    .select('tag_id, name, color_code')

  const { data: daos } = await supabase
    .from('daos')
    .select('dao_id, name, logo_url, contract_address')

  return { props: { daos, tags } }
}
