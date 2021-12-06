import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
// Supabase
import { supabase } from '../../../libs/supabase'

export default function Job({ job }) {
  console.log({ job })

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto">
        {/* Grid - START */}
        <div className="grid grid-cols-5 gap-4">
          {/* Job - START */}
          <div className="container-result col-span-4">
            {/* Job Description - START */}
            <div>
              <div className="job-title">
                <h1 className="text-xl font-medium">
                  Looking for a graphics desginer for our new NFT
                </h1>
              </div>
              <div className="job-tag">
                <div className="flex justify-start gap-1">
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-gray-100 text-gray-800">
                      Badge
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-gray-100 text-gray-800">
                      Badge
                    </span>
                  </div>
                </div>
              </div>
              <div className="job-description mt-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </div>
            {/* Job Description - END */}
          </div>
          {/* Job - END */}
          {/* Sidebar - START */}
          <div className="container-filter col-span-1">DAO Info</div>
          {/* Sidebar - END */}
        </div>
        {/* Grid - END */}
      </main>
    </div>
  )
}

export const getStaticPaths = async () => {
  const { data: jobs } = await supabase.from('jobs').select('id')

  const paths = jobs.map(({ id }) => ({
    params: {
      jobId: id.toString()
    }
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { jobId } }) => {
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  return { props: { job } }
}
