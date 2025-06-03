'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function BrandPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'Please select an image file' })
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleProcess = async () => {
    if (!selectedFile) {
      setNotification({ type: 'error', message: 'Please select a file first' })
      return
    }

    try {
      setIsProcessing(true)
      const formData = new FormData()
      formData.append('icon', selectedFile)

      const response = await fetch('/api/update-favicon', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image')
      }

      setNotification({ type: 'success', message: 'Favicon has been updated successfully' })
    } catch (error) {
      console.error('Processing error:', error)
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Failed to process image' })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="space-y-2  pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Brand Settings
        </h1>
      </div>

      <div className="prose dark:prose-dark">
        <div className="mb-8">
          <h2>Website Icon</h2>
          <p>Upload a new icon for your website. The icon should be at least 512x512 pixels.</p>
          <p className="text-sm text-gray-500">The icon will be automatically converted to all necessary favicon formats.</p>
        </div>

        {notification && (
          <div className={`mb-4 p-4 rounded-md ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100' 
              : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />

          {previewUrl && (
            <div className="mb-4">
              <h3 className="mb-2">Preview:</h3>
              <div className="relative h-32 w-32 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Icon preview"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={!selectedFile || isProcessing}
            className="inline-flex items-center justify-center rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Update Favicon'}
          </button>
        </div>
      </div>
    </div>
  )
} 