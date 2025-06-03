'use client'

import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Page() {
  const { theme } = useTheme()
  const [logoSrc, setLogoSrc] = useState(siteMetadata.logo_dark)

  useEffect(() => {
    setLogoSrc(theme === 'light' ? siteMetadata.logo_light : siteMetadata.logo_dark)
  }, [theme])

  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <div className="md:mx-10">
      <AuthorLayout content={mainContent}> 
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </div>
  )
}
