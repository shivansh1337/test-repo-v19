'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-black">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-center text-sm text-red-500">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[50vh] bg-neutral-50 dark:bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow dark:bg-neutral-900">
        <div className="flex h-full flex-col">
          <div className="flex flex-shrink-0 items-center justify-center px-4 py-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Admin Panel
            </h2>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            <Link
              href="/admin"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/create"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              Create Post
            </Link>
            <Link
              href="/admin/brand"
              className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              Brand Settings
            </Link>
          </nav>
          <div className="flex flex-shrink-0 border-t border-neutral-200 p-4 dark:border-neutral-700">
            <button
              onClick={() => {
                localStorage.removeItem('adminAuth')
                setIsAuthenticated(false)
                router.push('/admin')
              }}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
} 