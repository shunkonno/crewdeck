// Nextjs
import Image from 'next/image'

// Components
import { LandingPageLayout } from '@components/ui/Layout'
import { MetaTags } from '@components/ui/MetaTags'

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
        <div className="bg-white">
          <div className="max-w-7xl mx-sm lg:mx-auto">
            <div className="flex items-center py-md sm:py-3xl">
              <div className="w-full md:w-1/2">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold leading-extra-tight lg:leading-tight">
                    Manage Bounties <br /> for NFT-gated DAOs
                  </h1>
                </div>
                <div className="mt-sm sm:mt-xs">
                  <p>
                    <span className="inline text-lg font-bold leading-normal">
                      Managing bounties on Discord channels is <i>hard</i>. Bad
                      management of tasks leaves people unsure how to
                      contribute.&nbsp;
                    </span>
                    <div className="relative inline-block w-5 h-5 align-text-bottom">
                      <Image
                        src={'/images/icons/moyamoya.png'}
                        layout="fill"
                        alt="moyamoya"
                      />
                    </div>
                  </p>
                </div>
                <div className="mt-sm sm:mt-xs">
                  <p className="text-lg text-slate-800">
                    Keep track of who&apos;s working on what, and compensate
                    fairly. Get people contributing from within the DAO, or make
                    the bounty public.
                  </p>
                </div>
                <div className="mt-sm sm:mt-xs">
                  <a
                    href="https://docs.google.com/forms/d/1J_xx0eTRmsSwzsXFUVUwilhtOYqJfBJhqQH_5Wt9NH0/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="bg-primary px-8 py-3 rounded-md text-white text-sm tracking-wide font-semibold">
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

        {/* Section - START */}
        <section className="px-sm py-md sm:py-2xl bg-teal-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Left Item - START */}
              <div className="px-sm py-md sm:py-2xl bg-white rounded-md">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {`Manage Bounties`}
                  </h2>
                </div>
                <div className="mt-4 w-full">
                  <p className="text-lg">
                    {`Allow NFT owners to post and manage
                    bounties. (We're also working to bring more methods of
                    collaboration and compensation on bounties.)`}
                  </p>
                </div>
                <div className="flex justify-center mt-8">
                  <div className="relative w-64 h-20 sm:w-80 sm:h-52 md:w-96 md:h-32 overflow-hidden">
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
              <div className="px-sm py-md sm:py-2xl bg-white rounded-md">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {`Post Public Bounties`}
                  </h2>
                </div>
                <div className="mt-4 w-full">
                  <p className="text-lg">
                    {`Sometimes, the skillset necessary for a certain task is outside the scope of the DAO. Public bounties can be searched and acheived by anyone interested.`}
                  </p>
                </div>
                <div className="flex justify-center mt-8">
                  <div className="relative w-64 h-20 sm:w-80 sm:h-52 md:w-96 md:h-32 overflow-hidden">
                    <Image
                      src={'/images/support/callingOthers.jpg'}
                      alt="calling others"
                      layout="fill"
                    />
                  </div>
                </div>
              </div>
              {/* Right Item - END */}
            </div>
          </div>
        </section>
        {/* Section - END */}

        {/* Section - START */}
        <section className="bg-slate-600 px-sm py-md sm:py-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-cyan-600 sm:inline-block">
                  Get more contributors.
                </h3>
              </div>
              <div>
                <a
                  href="https://docs.google.com/forms/d/1J_xx0eTRmsSwzsXFUVUwilhtOYqJfBJhqQH_5Wt9NH0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" bg-primary px-8 py-3 rounded-md text-white text-sm tracking-wide font-semibold">
                    Early Entry
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Section - END */}

        {/* LP Content - END */}
      </div>
      {/* Grid - END */}
    </>
  )
}

Home.Layout = LandingPageLayout
