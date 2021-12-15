import sanitizeHTML from 'sanitize-html'
// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
// Supabase
import { supabase } from '@libs/supabase'

const dummyTags = [
  { id: '1', name: 'non-technical' },
  { id: '2', name: 'graphics' },
  { id: '3', name: 'NFT' }
]

export default function Job({ job, dao }) {
  console.log({ job, dao })

  // Sanitizes HTML.
  // @param {string} rawHtml
  // @returns {striing} sanitizedHtml
  function composeSanitizedHTML(rawHTML) {
    const options = {
      allowedTags: [
        'h1',
        'h2',
        'h3',
        'li',
        'ol',
        'p',
        'ul',
        'a',
        'br',
        'u',
        'em',
        'strong',
        'blockquote'
      ],
      allowedAttributes: {
        a: ['href', 'rel', 'target']
      }
    }

    const sanitizedHTML = sanitizeHTML(rawHTML, options)
    return sanitizedHTML
  }

  // Returns object to set using dangerouslySetInnerHTML
  // @param {string} rawHtml
  // @returns {striing} sanitizedHtml
  function composeInnerHTML(rawHTML) {
    // Sanitize HTML.
    const sanitizedHTML = composeSanitizedHTML(rawHTML)
    // Return HTML as object.
    return { __html: sanitizedHTML }
  }

  return (
    <>
      <SEO title="Job Detail" description="Job Detail" />
      {/* Grid - START */}
      <div className="py-md block sm:flex px-4 sm:px-xs max-w-5xl mx-auto">
        {/* Job - START */}
        <div className="flex-1">
          {/* Job Title - START */}
          <div className="job-title">
            <h1 className="text-2xl font-medium">{job.title}</h1>
          </div>
          {/* Job Title - END */}
          {/* Job Tags - START */}
          <div className="job-tag mt-sm">
            <div className="flex justify-start gap-1">
              {dummyTags.map((dummyTag) => (
                <div key={dummyTag.id}>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-slate-200 text-slate-800">
                    {dummyTag.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Job Tags - END */}
          {/* Job Description - START */}
          <div className="mt-lg">
            <article
              className="prose"
              dangerouslySetInnerHTML={composeInnerHTML(job.description)}
            />
          </div>
          {/* Job Description - END */}
        </div>
        {/* Job - END */}
        {/* Sidebar - START */}
        <div className="flex-shrink-1 w-full sm:w-80 mt-md sm:mt-0">
          <div className="bg-white border border-slate-300 p-xs rounded-lg">
            <div className="inline-flex items-center">
              {dao.logo_url &&
                <img
                  src={dao.logo_url}
                  className="inline-block flex-shrink-0 h-8 w-8 rounded-full mr-3"
                />
              }
              <h1 className="text-lg font-semibold">{dao.name}</h1>
            </div>
            <p className="mt-1 text-slate-600">{dao.description}</p>
            {dao.discord_url || dao.twitter_url && (
              <div className="inline-flex gap-3 mt-xs">
                {dao.discord_url && (
                  <a
                    href={dao.discord_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="shadow-md p-2.5 rounded-full hover:shadow-lg">
                      <img
                        src={'/images/social/DiscordIcon.png'}
                        className="flex-shrink-0 h-6 w-6"
                      />
                    </div>
                  </a>
                )}
                {dao.twitter_url && (
                  <a
                    href={dao.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="shadow-md p-2.5 rounded-full hover:shadow-lg">
                      <img
                        src={'/images/social/TwitterIcon.png'}
                        className="flex-shrink-0 h-6 w-6"
                      />
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Sidebar - END */}
      </div>
      {/* Grid - END */}
    </>
  )
}

Job.Layout = BaseLayout

export const getStaticPaths = async () => {
  // Get all ids in jobs table.
  const { data: jobs } = await supabase.from('jobs').select('id')

  const paths = jobs.map(({ id }) => ({
    params: {
      jobId: id.toString()
    }
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { jobId } }) => {
  // Get job info.
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  // Get info on the DAO that posted the job.
  const { data: dao } = await supabase
    .from('daos')
    .select('*')
    .eq('id', job.dao_id)
    .single()

  return { props: { job, dao } }
}
