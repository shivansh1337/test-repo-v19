import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Octokit } from '@octokit/rest'

async function uploadToGitHub(filename: string, content: string) {
  const token = process.env.GITHUB_TOKEN
  const owner = 'myblackbeanca'
  const repo = 'weekend-v1'
  const filePath = `data/blog/${filename}`
  
  const octokit = new Octokit({
    auth: token
  })

  try {
    // First, try to get the file to check if it exists
    let sha: string | undefined
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
      })
      
      if (!Array.isArray(fileData)) {
        sha = fileData.sha
      }
    } catch (error) {
      // File doesn't exist, which is fine for new files
    }

    // Create or update file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Add/Update blog post: ${filename}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    })

    return { success: true }
  } catch (error) {
    console.error('Error uploading to GitHub:', error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json()

    // Validate input
    if (!filename || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure filename is safe
    if (!/^[a-z0-9-]+\.mdx$/.test(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    if (process.env.NODE_ENV === 'development') {
      // Save locally in development
      const filePath = path.join(process.cwd(), 'data', 'blog', filename)
      await writeFile(filePath, content, 'utf-8')
    } else {
      // Upload to GitHub in production
      if (!process.env.GITHUB_TOKEN) {
        return NextResponse.json(
          { error: 'GitHub token not configured' },
          { status: 500 }
        )
      }
      await uploadToGitHub(filename, content)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving blog post:', error)
    return NextResponse.json(
      { error: 'Failed to save blog post' },
      { status: 500 }
    )
  }
}