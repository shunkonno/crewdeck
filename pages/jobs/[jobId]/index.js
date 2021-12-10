import sanitizeHTML from 'sanitize-html'
// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
// Supabase
import { supabase } from '@libs/supabase'

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
      <div className="grid grid-cols-5 gap-4">
        {/* Job - START */}
        <div className="container-result col-span-4">
          {/* Job Title - START */}
          <div className="job-title">
            <h1 className="text-xl font-medium">{job.title}</h1>
          </div>
          {/* Job Title - END */}
          {/* Job Tags - START */}
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
          {/* Job Tags - END */}
          {/* Job Description - START */}
          <div
            className="job-description mt-8"
            dangerouslySetInnerHTML={composeInnerHTML(job.description)}
          />
          {/* Job Description - END */}
        </div>
        {/* Job - END */}
        {/* Sidebar - START */}
        <div className="container-filter col-span-1">DAO Info</div>
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
