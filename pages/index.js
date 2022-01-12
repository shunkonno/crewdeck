// Nextjs
import Image from 'next/image'

// Assets
import { InformationCircleIcon } from '@heroicons/react/outline'

// Components
import { BaseLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'

// Supabase
import { supabase } from '@libs/supabase'

export default function Home() {
  return (
    <>
      <MetaTags
        title="Crewdeck"
        description="Manage job and bounties for your DAO with Crewdeck."
      />
      {/* Grid - START */}
      <div>
        {/* TopContainer - START */}
        <div className="bg-slate-100">
          <div className="max-w-5xl mx-sm lg:mx-auto">
            <div className="flex items-center py-md sm:py-3xl">
              <div className="w-full md:w-1/2">
                <h1 className="text-4xl sm:text-5xl font-bold leading-extra-tight lg:leading-tight">
                  Manage Bounties <br /> for NFT-gated DAOs
                  {/* <p className="text-5xl mb-2">
                    <span className="leading-extra-tight lg:leading-tight">
                      for&nbsp;
                    </span>
                    <span className="pb-2 text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-blue-500 sm:inline-block leading-extra-tight lg:leading-tight">
                      NFT-gated DAOs
                    </span>
                  </p> */}
                </h1>
                <p className="mt-sm sm:mt-xs text-slate-800">
                  Keep track of who&apos;s working on what, and compensate
                  fairly. Get people contributing from within the DAO, or make
                  the bounty public.
                </p>
                <div>
                  <a
                    href="https://docs.google.com/forms/d/1J_xx0eTRmsSwzsXFUVUwilhtOYqJfBJhqQH_5Wt9NH0/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="mt-sm sm:mt-xs bg-primary px-8 py-3 rounded-md text-white text-sm tracking-wide font-semibold">
                      Early Entry
                    </button>
                  </a>
                </div>
              </div>
              <div className="hidden md:w-1/2 md:flex justify-end">
                <div className="relative sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-2xl overflow-hidden">
                  <Image
                    src={'/images/hero/yacht.jpg'}
                    alt="hero-image"
                    layout={'fill'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* TopContainer - END */}

        {/* LP Content - START */}
        <section className="bg-white px-sm py-md sm:py-2xl border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4">
              <h2 className="inline text-2xl sm:text-3xl font-medium leading-normal">
                Managing bounties on Discord is <i>hard</i>.&nbsp;
              </h2>
              <div className="relative inline-block w-6 h-6 sm:py-0">
                <Image
                  src={'/images/icons/moyamoya.png'}
                  layout="fill"
                  alt="moyamoya"
                />
              </div>
            </div>
            <p className="">
              {`Bad management of tasks leads to people feeling unsure how to
              contribute.`}
            </p>
            <p className="mt-2">{`If contributing requires...`}</p>
            <ul>
              <li>{`Checking every Discord channel to keep track of potential opportunities`}</li>
              <li>{`Scrolling up & down the chat to check if a particular task is being worked on, and by whom`}</li>
            </ul>
            <strong className="mt-2 inline-block">{`Use Crewdeck instead, to manage bounties and lower barriers to contributing.`}</strong>
          </div>
        </section>

        <section className="bg-white px-sm py-md sm:py-2xl">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Left Item - START */}
              <div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium">
                    {`Manage Bounties`}
                  </h2>
                </div>
                <div className="mt-4 w-full">
                  <p>
                    {`Crewdeck is an easy way to allow NFT owners to post/manage
                    bounties. We're also working to bring more methods of
                    collaboration and compensation on bounties.`}
                  </p>
                </div>
                <div className="hidden md:flex justify-left mt-8">
                  <div className="relative sm:w-80 sm:h-52 md:w-96 md:h-32 overflow-hidden">
                    <Image
                      src={'/images/support/workingTogether.jpg'}
                      alt="working together"
                      layout="fill"
                    />
                  </div>
                </div>
              </div>
              {/* Left Item - END */}
              {/* Right Item - START */}
              <div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium">
                    {`Post Public Bounties`}
                  </h2>
                </div>
                <div className="mt-4 w-full">
                  <p>
                    {`Sometimes, the skillset necessary for a certain task is outside the scope of the DAO. Public bounties can be searched and acheived by anyone interested.`}
                  </p>
                </div>
              </div>
              {/* Right Item - END */}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-sm py-md sm:py-2xl">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-cyan-600 sm:inline-block">
                  Manage DAO bounties well.
                </h3>
              </div>
              <div>
                <a
                  href="https://docs.google.com/forms/d/1J_xx0eTRmsSwzsXFUVUwilhtOYqJfBJhqQH_5Wt9NH0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="mt-sm sm:mt-xs bg-primary px-8 py-3 rounded-md text-white text-sm tracking-wide font-semibold">
                    Early Entry
                  </button>
                </a>
              </div>
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
