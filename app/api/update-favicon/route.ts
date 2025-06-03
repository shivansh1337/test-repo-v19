import { NextRequest, NextResponse } from 'next/server'
import { favicons } from 'favicons'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const iconFile = formData.get('icon') as File
    
    if (!iconFile) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await iconFile.arrayBuffer())
    
    // Verify image dimensions
    const source = buffer
    const configuration = {
      path: '/static/favicons', // Path for overriding default icons path
      appName: 'WEEKEND Blog', // Your application's name
      appShortName: 'WEEKEND', // Your application's short name
      appDescription: "Unlock a new perspective every Friday at 6 PM EST.",
      background: 'transparent', // Changed from '#fff' to 'transparent'
      theme_color: '#fff', // Theme color for browser chrome
      icons: {
        android: true, // Create Android homescreen icon
        appleIcon: true, // Create Apple touch icons
        appleStartup: false, // Create Apple startup images
        favicons: true, // Create regular favicons
        windows: true, // Create Windows 8 tile icons
        yandex: false, // Create Yandex browser icon
      },
    }

    const response = await favicons(source, configuration)

    // Write files to the public directory
    for (const image of response.images) {
      await writeFile(
        path.join(process.cwd(), 'public', 'static', 'favicons', image.name),
        image.contents
      )
    }

    // Write files that need to be at the site root
    const rootFiles = ['favicon.ico', 'apple-touch-icon.png']
    for (const image of response.images) {
      if (rootFiles.includes(image.name)) {
        await writeFile(
          path.join(process.cwd(), 'public', image.name),
          image.contents
        )
      }
    }

    // Write the manifest file
    const manifestFile = response.files.find(file => file.name === 'manifest.json')
    if (manifestFile) {
      await writeFile(
        path.join(process.cwd(), 'public', 'static', 'favicons', 'site.webmanifest'),
        manifestFile.contents
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing favicon:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
} 