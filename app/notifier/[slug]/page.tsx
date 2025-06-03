'use client'

import { useState, use } from 'react'
import { allBlogs } from 'contentlayer/generated'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'

export default function NotifierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null)

  // Find post outside of render
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-red-600">Blog post not found</h1>
        <Link href="/admin" className="mt-4 text-blue-600 hover:underline">
          Back to Admin
        </Link>
      </div>
    )
  }

  const handleSendNotification = async () => {
    try {
      setSending(true)
      setResult(null)

      const response = await fetch(`/api/notify/${slug}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification')
      }

      setResult({ success: data.message })
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Failed to send notification' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">Send Blog Notification</h1>
          
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">Blog Details</h2>
            <p className="mb-1 text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Title:</span> {post.title}
            </p>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Summary:</span> {post.summary}
            </p>
          </div>

          {result && (
            <div
              className={`mb-4 rounded-lg p-4 ${
                result.success
                  ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                  : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
              }`}
            >
              {result.success || result.error}
            </div>
          )}

          <button
            onClick={handleSendNotification}
            disabled={sending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-600"
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">Email Preview</h2>
          
          <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
            <div className="border-b border-neutral-300 bg-neutral-50 p-4 dark:border-neutral-600 dark:bg-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>From:</strong> MINYVINYL Blog &lt;hello@minyvinyl.com&gt;
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Subject:</strong> New Blog Post: {post.title}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mx-auto max-w-[600px]">
                <div className="text-center">
                  <img 
                    src={`${siteMetadata.siteUrl}${siteMetadata.logo_dark}`} 
                    alt="MINYVINYL" 
                    className="mx-auto mb-4 h-12"
                  />
                  <span className="mb-6 inline-block rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                    New Blog Post
                  </span>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">
                  {post.title}
                </h1>
                <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                  {post.summary}
                </p>
                <div className="text-center">
                  <a
                    href={`${siteMetadata.siteUrl}/blog/${post.slug}`}
                    className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                  >
                    Read Full Blog Post
                  </a>
                </div>
                <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                  <p>You're receiving this email because you subscribed to MINYVINYL's blog newsletter.</p>
                  <p>© {new Date().getFullYear()} MINYVINYL. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 