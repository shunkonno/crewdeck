import sanitizeHTML from 'sanitize-html'
// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
// Supabase
import { supabase } from '@libs/supabase'

const dummyTags = [
  {id:'1', name:"non-technical"},
  {id:'2', name:"graphics"},
  {id:'3', name:"NFT"},
]

const dummyDao = {
  id:'1', 
  name:"buildspace",
  description:"buildspace is where people come to learn to build.",
  logo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  discord_url: 'aaa',
  twitter_url: 'bbb'
}

export default function Job({ job }) {
  console.log({ job })

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
      <SEO
       title="Job Detail"
       description="Job Detail"
      />
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
              {dummyTags.map((dummyTag)=>(
                <div key={dummyTag.id}>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-slate-200 text-slate-800">
                  {dummyTag.name}
                  </span>
                </div>
              ))
              }
            </div>
          </div>
          {/* Job Tags - END */}
          {/* Job Description - START */}
          <div
            className="job-description mt-lg"
            dangerouslySetInnerHTML={composeInnerHTML(job.description)}
          />
          {/* Job Description - END */}
        </div>
        {/* Job - END */}
        {/* Sidebar - START */}
        <div className="flex-shrink-1 w-full sm:w-80 mt-md sm:mt-0">
          <div className="bg-white border border-slate-300 p-xs rounded-lg">
            <div className="inline-flex items-center">
              <img 
                src={dummyDao.logo_url}
                className="flex-shrink-0 h-8 w-8 rounded-full"
              />
              <h1 className="ml-3 text-lg font-semibold">{dummyDao.name}</h1>
            </div>
              <p className="mt-1 text-slate-600">
                {dummyDao.description}
              </p>
              {dummyDao.discord_url && 
                dummyDao.twitter_url &&
                  <div className="inline-flex gap-3 mt-xs">
                    {dummyDao.discord_url &&
                      <a href={dummyDao.discord_url} target="_blank" rel="noreferrer">
                        <div className="shadow-md p-2.5 rounded-full hover:shadow-lg">
                          <img 
                            src={'/images/social/DiscordIcon.png'}
                            className="flex-shrink-0 h-6 w-6"
                          />
                        </div>
                      </a>
                    }
                    {dummyDao.twitter_url &&
                    <a href={dummyDao.twitter_url} target="_blank" rel="noreferrer">
                      <div className="shadow-md p-2.5 rounded-full hover:shadow-lg">
                        <img 
                          src={'/images/social/TwitterIcon.png'}
                          className="flex-shrink-0 h-6 w-6"
                        />
                      </div>
                    </a>
                    }
                  </div>
              }
              
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
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  return { props: { job } }
}
