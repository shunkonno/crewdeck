// Truncates the public address of the connected wallet.
// @param {string} address - The public address of the wallet.
// @returns {string} - The truncated address.
export function truncateAddress(address) {
  let firstFiveLetters = address.substring(0, 5)
  let lastFiveLetters = address.substring(address.length - 5)
  let truncatedAddress = firstFiveLetters + '...' + lastFiveLetters

  return truncatedAddress
}
