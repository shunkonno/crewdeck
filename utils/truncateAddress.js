// Truncates the public address of the connected wallet.
// @param {string} address - The public address of the wallet.
// @returns {string} - The truncated address.
export function truncateAddress(address) {
  const firstFiveLetters = address.substring(0, 5)
  const lastFiveLetters = address.substring(address.length - 5)
  const truncatedAddress = firstFiveLetters + '...' + lastFiveLetters

  return truncatedAddress
}
