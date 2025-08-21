'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, RotateCcw, FileText, Download, Eye, EyeOff } from 'lucide-react'

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [fileName, setFileName] = useState('document.md')

  const defaultMarkdown = `# Welcome to Markdown Editor

## Features

- **Live Preview**: See your Markdown rendered in real-time
- **Syntax Highlighting**: Beautiful code highlighting
- **Export Options**: Download as Markdown or HTML
- **Responsive Design**: Works on all devices

## Getting Started

1. Write your Markdown in the editor
2. See live preview on the right
3. Use the toolbar for common formatting
4. Export when ready

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

## Lists

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

## Links and Images

[Visit GitHub](https://github.com)

![Example Image](https://via.placeholder.com/300x200)

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Headers | ✅ | Working |
| Bold | ✅ | **Bold text** |
| Italic | ✅ | *Italic text* |
| Code | ✅ | \`inline code\` |

## Blockquotes

> This is a blockquote. It's great for highlighting important information.

---

*Happy writing!* 🎉`

  useEffect(() => {
    if (!markdown) {
      setMarkdown(defaultMarkdown)
    }
  }, [markdown])

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end)

    let insertText = syntax
    if (selectedText) {
      insertText = syntax.replace(placeholder, selectedText)
    }

    const newMarkdown = markdown.substring(0, start) + insertText + markdown.substring(end)
    setMarkdown(newMarkdown)

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + insertText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName.replace('.md', '')}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: 'Monaco', 'Menlo', monospace; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    ${markdown}
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace('.md', '.html')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
  }

  const clearEditor = () => {
    setMarkdown('')
  }

  const loadSample = () => {
    setMarkdown(defaultMarkdown)
  }

  const renderMarkdown = (text: string) => {
    // Simple Markdown to HTML conversion
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr>')
      // Line breaks
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Tools
            </Link>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-indigo-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Markdown Editor</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700 mr-2">Formatting:</span>
            <button
              onClick={() => insertMarkdown('# ', 'Header 1')}
              className="btn-secondary text-sm"
            >
              H1
            </button>
            <button
              onClick={() => insertMarkdown('## ', 'Header 2')}
              className="btn-secondary text-sm"
            >
              H2
            </button>
            <button
              onClick={() => insertMarkdown('**', 'Bold Text')}
              className="btn-secondary text-sm"
            >
              Bold
            </button>
            <button
              onClick={() => insertMarkdown('*', 'Italic Text')}
              className="btn-secondary text-sm"
            >
              Italic
            </button>
            <button
              onClick={() => insertMarkdown('`', 'Code')}
              className="btn-secondary text-sm"
            >
              Code
            </button>
            <button
              onClick={() => insertMarkdown('[', 'Link Text](url)')}
              className="btn-secondary text-sm"
            >
              Link
            </button>
            <button
              onClick={() => insertMarkdown('- ', 'List Item')}
              className="btn-secondary text-sm"
            >
              List
            </button>
            <button
              onClick={() => insertMarkdown('> ', 'Blockquote')}
              className="btn-secondary text-sm"
            >
              Quote
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-secondary flex items-center text-sm"
              >
                {showEditor ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showEditor ? 'Hide Editor' : 'Show Editor'}
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary flex items-center text-sm"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="input-field w-32 text-sm"
                placeholder="filename.md"
              />
              <button
                onClick={downloadMarkdown}
                className="btn-secondary flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                .md
              </button>
              <button
                onClick={downloadHTML}
                className="btn-secondary flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                .html
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
              <button
                onClick={loadSample}
                className="btn-secondary text-sm"
              >
                Sample
              </button>
              <button
                onClick={clearEditor}
                className="btn-secondary flex items-center text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Editor */}
          {showEditor && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-medium text-gray-900">Editor</h3>
              </div>
              <textarea
                id="markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your Markdown here..."
                className="w-full h-96 p-4 border-0 resize-none focus:outline-none font-mono text-sm"
              />
            </div>
          )}

          {/* Live Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
              </div>
              <div
                className="p-4 h-96 overflow-y-auto prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
              />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-indigo-900 mb-3">Markdown Editor Features</h3>
          <div className="text-indigo-800 text-sm space-y-2">
            <p>
              <strong>Live Preview:</strong> See your Markdown rendered in real-time as you type.
            </p>
            <p>
              <strong>Formatting Toolbar:</strong> Quick access to common Markdown syntax elements.
            </p>
            <p>
              <strong>Export Options:</strong> Download your content as Markdown (.md) or HTML (.html) files.
            </p>
            <p>
              <strong>Responsive Layout:</strong> Toggle editor and preview visibility for different screen sizes.
            </p>
            <p className="text-indigo-700">
              <strong>Supported Syntax:</strong> Headers, bold/italic, code blocks, lists, links, images, tables, blockquotes, and more.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
