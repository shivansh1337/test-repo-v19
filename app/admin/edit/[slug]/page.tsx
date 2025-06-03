'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { allBlogs } from 'contentlayer/generated';

export default function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    draft: false,
    summary: '',
    slug: '',
    content: ''
  });
  const [isClient, setIsClient] = useState(false);
  const { slug } = React.use(params) as { slug: string };

  // Load existing blog post data
  useEffect(() => {
    const post = allBlogs.find((p) => p.slug === slug);
    if (post) {
      const content = post.body.raw;
      const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '').trim();
      
      setFormData({
        title: post.title,
        date: post.date,
        tags: post.tags ? post.tags.join(', ') : '',
        draft: post.draft || false,
        summary: post.summary || '',
        slug: post.slug,
        content: contentWithoutFrontmatter
      });
    }
    setIsClient(true);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format tags properly
      const formattedTags = formData.tags
        .split(',')
        .map(tag => `'${tag.trim().replace(/'/g, "''")}'`)
        .join(', ');

      // Escape special characters
      const escapedContent = formData.content.replace(/\$/g, '\\$').replace(/'/g, "''");
      const escapedTitle = formData.title.replace(/'/g, "''").replace(/\$/g, '\\$');
      const escapedSummary = formData.summary.replace(/'/g, "''").replace(/\$/g, '\\$');

      // Create the MDX content with proper frontmatter
      const mdxContent = `---
title: '${escapedTitle}'
date: '${formData.date}'
tags: [${formattedTags}]
draft: ${formData.draft}
summary: '${escapedSummary}'
---

${escapedContent}`;

      // Use the same filename as the original post
      const filename = slug + '.mdx';
      const response = await fetch('/api/save-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          content: mdxContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }

      alert('Blog post has been updated!');
      router.push('/admin');
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Error updating blog post. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Add URL-valid text validation for slug
    if (name === 'slug') {
      newValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Add loading state check
  if (!isClient) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="mx-auto w-full p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Edit Blog Post</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Make changes to your blog post here
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            URL Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens are allowed"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={3}
            required
            value={formData.summary}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={20}
            required
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 font-mono"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="draft"
            id="draft"
            checked={formData.draft}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="draft" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
            Save as draft
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="rounded bg-neutral-500 px-4 py-2 text-white hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
} 