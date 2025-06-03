'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import dynamic from 'next/dynamic';
import { BlockNoteEditor as BlockNoteEditorType } from '@blocknote/core';
import { processWithOpenAI } from '@/components/OpenAIProcessor';

// Add dynamic imports for BlockNote components
const BlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

const BlockNoteEditor = dynamic(
  () => import("@blocknote/react").then((mod) => {
    const { useCreateBlockNote } = mod;
    return function BlockNoteEditorWrapper({ editorRef, ...props }: any) {
      const editor = useCreateBlockNote();
      
      useEffect(() => {
        if (editorRef?.current !== editor) {
          editorRef.current = editor;
        }
      }, [editor, editorRef]);

      return <BlockNoteView editor={editor} {...props} />;
    };
  }),
  { ssr: false }
);

export default function CreateBlog() {
  const router = useRouter();
  const editorRef = useRef<BlockNoteEditorType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    draft: false,
    summary: '',
    slug: '',
    mixtape: {
      name: '',
      imageUrl: '',
      shortenedLink: ''
    }
  });
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add useEffect for client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log(formData);

  const createMDXContent = async (editorInstance: any) => {
    const markdown = await editorInstance.blocksToMarkdownLossy(editorInstance.topLevelBlocks);
    
    // Format tags properly
    const formattedTags = formData.tags
      .split(',')
      .map(tag => `'${tag.trim().replace(/'/g, "''")}'`)
      .join(', ');

    // Escape dollar signs in markdown content
    const escapedMarkdown = markdown.replace(/\$/g, '\\$').replace(/'/g, "''");

    // Escape single quotes in frontmatter values
    const escapedTitle = formData.title.replace(/'/g, "''").replace(/\$/g, '\\$')
    const escapedSummary = formData.summary.replace(/'/g, "''").replace(/\$/g, '\\$')

    // Create mixtape frontmatter if fields are filled
    const mixtapeFrontmatter = formData.mixtape.name || formData.mixtape.imageUrl || formData.mixtape.shortenedLink
      ? `mixtape:
  name: '${formData.mixtape.name.replace(/'/g, "''")}'
  imageUrl: '${formData.mixtape.imageUrl.replace(/'/g, "''")}'
  shortenedLink: '${formData.mixtape.shortenedLink.replace(/'/g, "''")}'`
      : '';

    // Create the MDX content with proper frontmatter formatting
    const frontmatter = `---
title: '${escapedTitle}'
date: '${formData.date}'
tags: [${formattedTags}]
draft: ${formData.draft}
summary: '${escapedSummary}'
${mixtapeFrontmatter}
---

${escapedMarkdown}`;

    return frontmatter;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editorRef.current) {
        throw new Error('Editor instance not found');
      }

      const mdxContent = await createMDXContent(editorRef.current);
      
      // Create filename from title (convert to kebab case)
      const filename = formData.slug + '.mdx'
        try {
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

          alert('Blog post has been saved to data/blog directory!');
          router.push('/admin/create');
        } catch (error) {
          console.error('Error saving blog post:', error);
          throw error;
        }
      
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post. Please try again.');
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
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: newValue,
      };
      console.log('Form data updated:', newData);
      return newData;
    });
  };

  // Handle editor content changes
  const handleEditorChange = async () => {
    if (!editorRef.current) return;
    const markdown = await editorRef.current.blocksToMarkdownLossy(editorRef.current.topLevelBlocks);
    console.log('Editor content changed:', markdown);
  };

  const processAIContent = async (content: string) => {
    setIsProcessing(true);
    try {
      // Get title
      const titlePrompt = "If title tag is present in content use it or else Generate a concise and engaging title for this blog post. Return only the title text, nothing else.";
      const titleResult = await processWithOpenAI({ content, prompt: titlePrompt });
      
      // Get summary
      const summaryPrompt = "If Meta Description in content use it or else Write a brief meta desrciption of content. Return only the Description text, nothing else.";
      const summaryResult = await processWithOpenAI({ content, prompt: summaryPrompt });
      
      // Get tags
      const tagsPrompt = "If Keyword or Tags in content use it or else find prominent keywords found in blog post 3-4, key should be from content. Return only comma-separated tags, nothing else.";
      const tagsResult = await processWithOpenAI({ content, prompt: tagsPrompt });
      
      // Get slug
      const slugPrompt = "If slug in content use it or else Generate a URL-friendly slug for this blog post title. Use only lowercase letters, numbers, and hyphens. keep length of slug less than 60 characters. Return only the slug, nothing else.";
      const slugResult = await processWithOpenAI({ content, prompt: slugPrompt });

      setFormData(prev => ({
        ...prev,
        title: titleResult.trim(),
        summary: summaryResult.trim(),
        tags: tagsResult.trim(),
        slug: slugResult.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      }));

      
    } catch (error) {
      console.error('Error processing with AI:', error);
      alert('Error processing content with AI');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add loading state check
  if (!isClient) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-6">
        <label
          htmlFor="aiContent"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Paste your content here for AI processing
        </label>
        <textarea
          id="aiContent"
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
          rows={5}
          placeholder="Paste your content here and click Process to automatically fill the form fields..."
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              const content = (document.getElementById('aiContent') as HTMLTextAreaElement).value;
              if (content) {
                processAIContent(content);
              }
            }}
            disabled={isProcessing}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-green-300"
          >
            {isProcessing ? 'Processing...' : 'Process with AI'}
          </button>
        </div>
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
            placeholder="Enter the title of your blog"
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
            placeholder="url-friendly-slug"
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
            placeholder="Write a brief summary of the blog"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Content
          </label>
          <div className="overflow-hidden rounded-md border">
            <BlockNoteEditor
              editorRef={editorRef}
              onChange={handleEditorChange}
              className="min-h-[400px]"
            />
          </div>
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

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">Featured Mixtape</h3>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="mixtapeName"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Mixtape Name
              </label>
              <input
                type="text"
                name="mixtape.name"
                id="mixtapeName"
                value={formData.mixtape.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mixtape: {
                    ...prev.mixtape,
                    name: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
                placeholder="Enter the mixtape name"
              />
            </div>

            <div>
              <label
                htmlFor="mixtapeImageUrl"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Mixtape Image URL
              </label>
              <input
                type="text"
                name="mixtape.imageUrl"
                id="mixtapeImageUrl"
                value={formData.mixtape.imageUrl}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mixtape: {
                    ...prev.mixtape,
                    imageUrl: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
                placeholder="Enter the mixtape image URL"
              />
            </div>

            <div>
              <label
                htmlFor="mixtapeShortenedLink"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Mixtape Shortened Link
              </label>
              <input
                type="text"
                name="mixtape.shortenedLink"
                id="mixtapeShortenedLink"
                value={formData.mixtape.shortenedLink}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mixtape: {
                    ...prev.mixtape,
                    shortenedLink: e.target.value
                  }
                }))}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
                placeholder="Enter the shortened link"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
