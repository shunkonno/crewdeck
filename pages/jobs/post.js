import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { ethers } from 'ethers'
// Contexts
import { useAccount } from '@contexts/AccountContext'
// Components
import { BaseLayout } from '@components/ui/Layout'
import { SEO } from '@components/ui/SEO'
// Supabase
import { supabase } from '@libs/supabase'
// Quill Editor - Dynamic import to prevent SSR
// https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function PostJob({ daoList }) {
  const { currentAccount, ethersProvider } = useAccount()

  // Values to submit to server. ***********
  const [title, setTitle] = useState('')
  const [dao, setDao] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  console.log({ title, editorContent, isPublic })
  // ***************************************

  console.log(daoList)

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

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote']
    ]
  }

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
    <>
      <SEO
       title="Post Job"
       description="Post Job"
      />
      {/* Form - START */}
      <div>
        <form onSubmit={handleSubmit}>
          {/* Title - START */}
          <div>
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
          </div>
          {/* Title - END */}
          {/* Tags - START */}
          <div>
            <div className="mt-1">
              {/* TODO: Improve UI for adding tags. i.e. - https://www.npmjs.com/package/react-tag-input */}
              <input type="text" className="" placeholder="Add Tags"></input>
            </div>
          </div>
          {/* Tags - END */}
          {/* DAO Selector - START */}
          <div>
            <label htmlFor="daos">DAO:</label>
            <select name="daos" id="daos">
              {/* Compose option element for each DAO in daoList. */}
              {/* TODO: https://tailwindui.com/components/application-ui/forms/select-menus#component-71d9116be789a254c260369f03472985 */}
              {daoList.map((dao) => {
                return (
                  <option value={dao.id} key={`daoselect-${dao.id}`}>
                    {dao.name}
                  </option>
                )
              })}
            </select>
          </div>
          {/* DAO Selector - END */}
          {/* Editor - START */}
          <div>
            <div className="mt-1">
              <ReactQuill
                theme="snow"
                modules={quillModules}
                value={editorContent}
                onChange={setEditorContent}
              />
            </div>
          </div>
          {/* Editor - END */}
          {/* Public Settings - START */}
          <div>
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
          </div>
          {/* Public Settings - END */}
          {/* Submit Button - START */}
          <div>
            <button
              className="bg-blue-200 px-4 py-2 text-sm font-bold rounded-sm"
              type="submit"
            >
              Post
            </button>
          </div>
          {/* Submit Button - END */}
        </form>
      </div>
      {/* Form - END */}
    </>
  )
}

PostJob.Layout = BaseLayout

export const getStaticProps = async () => {
  const { data: daoList } = await supabase
    .from('daos')
    .select('id, name, logo_url')

  return { props: { daoList } }
}
