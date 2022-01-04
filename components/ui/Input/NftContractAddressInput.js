import React, { useEffect, useState } from 'react'

export function NftContractAddressInput({
  onChange,
  nftContractAddress,
  name
}) {
  const [inputValue, setNftContractAddress] = useState(nftContractAddress || '')

  useEffect(() => {
    setNftContractAddress(nftContractAddress)
  }, [nftContractAddress])

  return (
    <>
      <input
        type="text"
        name={name}
        className="mt-1 py-2 shadow-sm border focus:outline-none focus:border-primary px-2 block w-full rounded-md border-slate-300"
        placeholder="0x..."
        onChange={(e) => {
          setNftContractAddress(e.target.value)
          onChange && onChange(e)
        }}
      />
    </>
  )
}
