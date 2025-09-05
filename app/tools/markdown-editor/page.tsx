'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Copy, RotateCcw, FileText, Download, Eye, EyeOff } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { renderToString } from 'react-dom/server'
import { coldarkDark, prism, tomorrow, okaidia, coy } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ClientToolLayout from '@/components/ClientToolLayout'

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

\`inline code\`

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

![Example Image](https://upload.wikimedia.org/wikipedia/commons/7/74/A-Cat.jpg)

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

*Happy writing!* 🎉
`

function useTextArea<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current && value !== ref.current.value) {
      ref.current.value = value as any
    }
  }, [value])

  return { value, setValue, ref }
}

const themes = {
  'Light': prism,
  'Dark': coldarkDark,
  'Tomorrow': tomorrow,
  'Okaidia': okaidia,
  'Coy': coy
}

export default function MarkdownEditor() {
  const { value: markdown, setValue: setMarkdown, ref: editorRef } = useTextArea(defaultMarkdown)
  const [showPreview, setShowPreview] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [fileName, setFileName] = useState('document.md')
  const [highlightedMarkdown, setHighlightedMarkdown] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('Light')
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    // Generate syntax highlighted HTML for overlay
    const highlighted = renderToString(
      <SyntaxHighlighter
        language="markdown"
        style={themes[selectedTheme] as any}
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.25rem'
        }}
      >
        {String(markdown)}
      </SyntaxHighlighter>
    )
    setHighlightedMarkdown(highlighted)
  }, [markdown, selectedTheme])

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setScrollTop(target.scrollTop)
  }

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const editor = editorRef.current
    if (!editor) return

    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = editor.value.substring(start, end)

    let insertText = syntax
    if (selectedText) {
      insertText = syntax.replace(placeholder, selectedText)
    }

    const newValue = editor.value.substring(0, start) + insertText + editor.value.substring(end)
    setMarkdown(newValue)

    // Restore cursor position
    setTimeout(() => {
      editor.focus()
      editor.setSelectionRange(start + insertText.length, start + insertText.length)
    }, 0)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([String(markdown)], { type: 'text/markdown' })
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
    ${String(markdown)}
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
    navigator.clipboard.writeText(String(markdown))
  }

  const clearEditor = () => {
    setMarkdown('')
  }

  const loadSample = () => {
    setMarkdown(defaultMarkdown)
  }

  return (
    <ClientToolLayout
      title="Markdown Editor"
      icon={FileText}
      iconColor="bg-indigo-500"
      description="Write and preview Markdown with live rendering and syntax highlighting"
      maxWidth="7xl"
    >
      {/* Toolbar */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-foreground mr-2">Formatting:</span>
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
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as keyof typeof themes)}
              className="input-field text-sm"
            >
              {Object.keys(themes).map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
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
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-lg font-medium text-foreground">Editor</h3>
            </div>
            <div className="relative h-96 overflow-hidden">
              {/* Syntax highlighting overlay */}
              <div
                className="absolute inset-0 p-4 font-mono text-sm pointer-events-none"
                style={{
                  color: 'transparent',
                  transform: `translateY(-${scrollTop}px)`,
                  height: 'auto',
                  minHeight: '100%'
                }}
                dangerouslySetInnerHTML={{ __html: highlightedMarkdown }}
              />
              {/* Editable text area */}
              <textarea
                ref={editorRef as any}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                onScroll={handleScroll}
                className="absolute inset-0 w-full h-full p-4 border-0 resize-none focus:outline-none font-mono text-sm overflow-y-auto bg-transparent text-transparent z-10"
                style={{
                  caretColor: '#4f46e5',
                  background: 'transparent'
                }}
                spellCheck={false}
              />
              {/* Visible text layer */}
              <div
                className="absolute inset-0 p-4 font-mono text-sm pointer-events-none"
                style={{
                  transform: `translateY(-${scrollTop}px)`,
                  height: 'auto',
                  minHeight: '100%'
                }}
                dangerouslySetInnerHTML={{ __html: highlightedMarkdown }}
              />
            </div>
          </div>
        )}

        {/* Live Preview */}
        {showPreview && (
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-lg font-medium text-foreground">Live Preview</h3>
            </div>
            <div
              className="p-4 h-96 overflow-y-auto prose prose-sm max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const { ref, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter
                        style={themes[selectedTheme] as any}
                        language={match[1]}
                        PreTag="div"
                        {...rest}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} style={{ backgroundColor: '#f0f0f0', borderRadius: '3px', padding: '2px 4px' }} {...props}>
                        {children}
                      </code>
                    )
                  },
                  a: ({ node, ...props }) => <a style={{ color: 'blue', textDecoration: 'underline' }} {...props} />,
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-border" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-muted" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-border px-4 py-2 text-foreground" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="even:bg-muted/50" {...props} />
                  )
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-200 mb-3">Markdown Editor Features</h3>
        <div className="text-indigo-800 dark:text-indigo-200 text-sm space-y-2">
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
          <p className="text-indigo-700 dark:text-indigo-300">
            <strong>Supported Syntax:</strong> Headers, bold/italic, code blocks, lists, links, images, tables, blockquotes, and more.
          </p>
        </div>
      </div>
    </ClientToolLayout>
  )
}
