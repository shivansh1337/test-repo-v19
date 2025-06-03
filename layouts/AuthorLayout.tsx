'use client'
import { ReactNode, useEffect, useState } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import { CoreContent } from 'pliny/utils/contentlayer'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { useTheme } from 'next-themes'

interface Props {
  children: ReactNode
  content: CoreContent<Authors>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter } = content

  const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [currentLogo, setCurrentLogo] = useState(siteMetadata.logo_dark)
  
    useEffect(() => {
      setMounted(true)
    }, [])
  
    useEffect(() => {
      if (mounted) {
        setCurrentLogo(resolvedTheme === 'light' ? siteMetadata.logo_light : siteMetadata.logo_dark)
      }
    }, [resolvedTheme, mounted])

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={currentLogo}
                alt="avatar"
                width={192}
                height={192}
                className="h-full w-28"
              />
            )}
            <Link
              href={siteMetadata.mainSiteUrl}
              className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {name}
            </Link>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="twitter" href={twitter} />
            </div>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
