import algoliasearch from 'algoliasearch'

export default function handler(req, res) {
  const objectArray = [req.body]

  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY_ADMIN
  )

  const index = client.initIndex('jobs')

  index.saveObjects(objectArray).then(({ objectIDs }) => {
    res.status(200).json({ message: `Added objectID: ${objectIDs[0]}` })
  })
}
