'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const sortedPosts = sortPosts(allBlogs)
    setPosts(sortedPosts)
  }, [])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Blog Posts</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manage your blog posts here
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow dark:border-neutral-700 dark:bg-neutral-800">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-800">
            {posts.map((post) => (
              <tr key={post.slug}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    {post.title}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(post.date)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      post.draft
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}
                  >
                    {post.draft ? 'Draft' : 'Published'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Edit
                    </Link>
                    {!post.draft && (
                      <Link
                        href={`/notifier/${post.slug}`}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Send
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 