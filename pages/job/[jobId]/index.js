import sanitizeHTML from 'sanitize-html'
// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
// Supabase
import { supabase } from '@libs/supabase'

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
      <div className="py-md flex flex-col lg:flex-row px-4 lg:px-xs lg:gap-2 max-w-7xl mx-auto">
        {/* Job - START */}
        <div className="lg:flex-1 bg-white p-xs border border-slate-300 rounded-lg">
          {/* Job Title - START */}
          <div>
            <h1 className="text-2xl font-semibold">{job.title}</h1>
          </div>
          {/* Job Title - END */}
          {/* Job Tags - START */}
          <div className="mt-1">
            <div className="flex justify-start gap-1">
              {job.tags.map((tag) => (
                <div key={tag.id}>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-slate-200 text-slate-800">
                    {tag.name}
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
        <div className="lg:flex-shrink-1 mt-md sm:mt-0 w-full lg:w-80">
          <div className="bg-white border border-slate-300 p-xs rounded-lg">
            <div className="inline-flex items-center">
              {dao.logo_url && (
                <img
                  src={dao.logo_url}
                  className="inline-block flex-shrink-0 h-8 w-8 rounded-full mr-3"
                />
              )}
              <h1 className="text-lg font-semibold">{dao.name}</h1>
            </div>
            <p className="mt-1 text-slate-600">{dao.description}</p>
            {(dao.discord_url || dao.twitter_url) && (
                <div className="inline-flex gap-4 mt-xs">
                  {dao.discord_url && (
                    <a href={dao.discord_url} target="_blank" rel="noreferrer">
                      <img
                        src={'/images/social/DiscordIcon.png'}
                        className="flex-shrink-0 h-6 w-6"
                      />
                    </a>
                  )}
                  {dao.twitter_url && (
                    <a href={dao.twitter_url} target="_blank" rel="noreferrer">
                      <img
                        src={'/images/social/TwitterIcon.png'}
                        className="flex-shrink-0 h-6 w-6"
                      />
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
  const { data: jobs } = await supabase.from('jobs').select('job_id')

  const paths = jobs.map(({ job_id }) => ({
    params: {
      jobId: job_id.toString()
    }
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { jobId } }) => {
  // Get job info.
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('job_id', jobId)
    .single()

  // Get tag_ids.
  const { data: tagIdList } = await supabase
    .from('jobs_to_tags')
    .select('tag_id')
    .eq('job_id', jobId)

  // If tags exist:
  if (tagIdList.length > 0) {
    // Compose query string for Supabase.
    let tagIdListString = ''

    tagIdList.map((item, index) => {
      if (index !== tagIdList.length - 1) {
        // Add a trailing comma until the last element.
        tagIdListString += 'id.eq.'
        tagIdListString += String(item.tag_id) + ','
      } else {
        tagIdListString += 'id.eq.'
        tagIdListString += String(item.tag_id)
      }
    })

    // Get tags.
    const { data: tags } = await supabase
      .from('tags')
      .select('*')
      .or(tagIdListString)

    // Insert tags data into job object.
    job.tags = tags
  } else {
    // If tags don't exist, set an empty array for job.tags element.
    job.tags = []
  }

  // Get info on the DAO that posted the job.
  const { data: dao } = await supabase
    .from('daos')
    .select('*')
    .eq('dao_id', job.dao_id)
    .single()

  return { props: { job, dao } }
}