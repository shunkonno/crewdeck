import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ethers } from 'ethers'
// Contexts
import { useAccount } from '../../contexts/AccountContext'
// Components
import { Header } from '../../components/Header'
// Quill Editor - Dynamic import to prevent SSR
// https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { supabase } from '../../libs/supabase'

export default function PostJob() {
  const { currentAccount, ethersProvider } = useAccount()
  // *****
  // Values to submit to server. - START
  const [title, setTitle] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  console.log({ title, editorContent, isPublic })
  // Values to submit to server. - END
  // *****

  const publicSettings = [
    {
      id: 'public',
      name: 'Public',
      description: 'Your post will show up on search results.'
    },
    {
      id: 'private',
      name: 'Private',
      description:
        'Access only if the person knows the URL. Your post will not show up on search results.'
    }
  ]

  // Saves data to DB.
  async function saveToDB() {
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        { title: title, description: editorContent, is_public: isPublic }
      ])

    if (error) {
      console.log(error)
    }
  }

  // Verifies if the user holds the private key for the public address. (EIP-191)
  // @returns {bool} isVerified - Returns whether the address has been verified.
  async function verifyAddressOwnership() {
    // Sign a message.
    const signer = ethersProvider.getSigner()
    const message =
      'Please sign this message for verification. This does not incur any gas fees.'
    const signature = await signer.signMessage(message)

    // Get public address used to sign the message.
    const address = ethers.utils.verifyMessage(message, signature)

    // If currentAccount equals address, we know that the user has the private key for the currentAccount.
    const isVerified = currentAccount === address ? true : false

    return isVerified
  }

  // Handles data submit.
  async function handleSubmit() {
    // Verify users' address.
    const isVerified = await verifyAddressOwnership()

    // Exit process if the users' address can't be verified.
    if (!isVerified) {
      return
    }

    // Save data to DB.
    await saveToDB()

    console.log('Successfully saved to DB.')

    // TODO: Redirect user to the newly created job post.
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto">
        {/* Header - START */}
        <Header />
        {/* Header - END */}
        {/* Input - START */}
        <div>
          {/* Title - START */}
          <div className="mt-1">
            <input
              type="text"
              className="text-2xl font-medium"
              placeholder="Title"
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            ></input>
          </div>
          {/* Title - END */}
        </div>
        <div>
          {/* Tags - START */}
          <div className="mt-1">
            {/* TODO: Improve UI for adding tags. i.e. - https://www.npmjs.com/package/react-tag-input */}
            <input type="text" className="" placeholder="Add Tags"></input>
          </div>
          {/* Tags - END */}
        </div>
        <div>
          {/* Editor - START */}
          <div className="mt-1">
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
            />
          </div>
          {/* Editor - END */}
        </div>
        <div>
          {/* Public Settings - START */}
          <fieldset>
            <legend className="sr-only">Public Settings</legend>
            <div className="space-y-5">
              {publicSettings.map((publicSetting) => (
                <div
                  key={publicSetting.id}
                  className="relative flex items-start"
                >
                  <div className="flex items-center h-5">
                    <input
                      id={publicSetting.id}
                      aria-describedby={`${publicSetting.id}-description`}
                      name="publicSetting"
                      type="radio"
                      defaultChecked={publicSetting.id === 'public'}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      onClick={() => {
                        setIsPublic(publicSetting.id === 'public')
                      }}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={publicSetting.id}
                      className="font-medium text-gray-700"
                    >
                      {publicSetting.name}
                    </label>
                    <p
                      id={`${publicSetting.id}-description`}
                      className="text-gray-500"
                    >
                      {publicSetting.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          {/* Public Settings - END */}
        </div>
        <div>
          {/* Submit Button - START */}
          <button
            className="bg-blue-200 px-4 py-2 text-sm font-bold rounded-sm"
            onClick={handleSubmit}
          >
            Post
          </button>
          {/* Submit Button - END */}
        </div>
        {/* Input - END */}
      </main>
    </div>
  )
}
