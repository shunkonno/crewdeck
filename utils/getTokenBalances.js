// Get token balance for a user's address to validate user's membership in a DAO.
// @params {string} eoaAddress - The public address of the user.
// @params {string} contractAddress - The contract address of the NFT for a DAO.
// @returns {object} tokenBalance - Returns either the balance or an error.

export async function getTokenBalances(eoaAddress, contractAddress) {
  const response = await fetch(
    `/api/alchemy/ethereum/mainnet/getTokenBalances/?user=${eoaAddress}&contract=${contractAddress}`
  )

  const data = await response.json()

  return data
}