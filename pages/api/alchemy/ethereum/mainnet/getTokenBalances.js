// Returns token balance for a specific address given the contract address in a list.
// https://docs.alchemy.com/alchemy/enhanced-apis/token-api#alchemy_gettokenbalance
// @query {string} userAddress
// @query {string} contractAddress
// @returns {object} response
export default async function handler(req, res) {
  const { user, contract } = req.query
  console.log({ user, contract })

  const url = `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY_MAINNET}`

  const requestBody = {
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getTokenBalances',
    params: [user, [contract]]
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  const data = await response.json()

  // Extract tokenBalances object
  const tokenBalance = data.result.tokenBalances[0]

  res.status(200).json(tokenBalance)
}
