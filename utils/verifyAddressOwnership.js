import { ethers } from 'ethers'

// Verifies if the user holds the private key for the public address. (EIP-191)
// @returns {bool} isVerified - Returns whether the address has been verified.
export const verifyAddressOwnership= async(currentAccount,ethersProvider) => {
  // Sign a message.
  const signer = ethersProvider.getSigner()
  const message =
    'Please sign this message for verification. This does not incur any gas fees.'
  const signature = await signer.signMessage(message)

  // Get public address used to sign the message.
  const address = ethers?.utils.verifyMessage(message, signature)

  // If currentAccount equals address, we know that the user has the private key for the currentAccount.
  const isVerified = currentAccount === address ? true : false

  return isVerified
}