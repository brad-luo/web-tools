'use client'

import { useState } from 'react'
import { Copy, RotateCcw, FileText, CheckCircle, XCircle, ArrowUpDown, SortAsc } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import toast, { Toaster } from 'react-hot-toast'
import ClientToolLayout from '../../components/ClientToolLayout'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const formatJson = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input.trim())
      const formattedJson = JSON.stringify(parsed, null, indentSize)
      setFormatted(formattedJson)
      setParsedJson(parsed)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
      setParsedJson(null)
    }
  }

  const minifyJson = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input.trim())
      const minified = JSON.stringify(parsed)
      setFormatted(minified)
      setParsedJson(parsed)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
      setParsedJson(null)
    }
  }

  const validateJson = () => {
    if (!input.trim()) return

    try {
      JSON.parse(input.trim())
      setIsValid(true)
      setError('')
      setFormatted('')
      setParsedJson(null)
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
      setParsedJson(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        duration: 2000,
        position: 'bottom-right',
      })
    }).catch(() => {
      toast.error('Failed to copy to clipboard', {
        duration: 2000,
        position: 'bottom-right',
      })
    })
  }

  const clearAll = () => {
    setInput('')
    setFormatted('')
    setParsedJson(null)
    setIsValid(null)
    setError('')
  }

  const loadSample = () => {
    const sample = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "hobbies": ["reading", "swimming", "coding"],
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "country": "USA"
  }
}`
    setInput(sample)

    // Also format the sample automatically
    try {
      const parsed = JSON.parse(sample)
      const formattedJson = JSON.stringify(parsed, null, indentSize)
      setFormatted(formattedJson)
      setParsedJson(parsed)
      setIsValid(true)
      setError('')
    } catch (err) {
      setFormatted('')
      setParsedJson(null)
      setIsValid(null)
      setError('')
    }
  }

  const sortObjectByKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => sortObjectByKeys(item))
    } else if (obj !== null && typeof obj === 'object') {
      const sortedKeys = Object.keys(obj).sort()
      const sortedObj: any = {}
      for (const key of sortedKeys) {
        sortedObj[key] = sortObjectByKeys(obj[key])
      }
      return sortedObj
    }
    return obj
  }

  const sortObjectByValues = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => sortObjectByValues(item))
    } else if (obj !== null && typeof obj === 'object') {
      const entries = Object.entries(obj)
      entries.sort(([, a], [, b]) => {
        // Convert values to strings for comparison
        const aStr = typeof a === 'object' ? JSON.stringify(a) : String(a)
        const bStr = typeof b === 'object' ? JSON.stringify(b) : String(b)
        return aStr.localeCompare(bStr)
      })

      const sortedObj: any = {}
      for (const [key, value] of entries) {
        sortedObj[key] = sortObjectByValues(value)
      }
      return sortedObj
    }
    return obj
  }

  const sortJsonByKeys = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input.trim())
      const sorted = sortObjectByKeys(parsed)
      const formattedJson = JSON.stringify(sorted, null, indentSize)
      setFormatted(formattedJson)
      setParsedJson(sorted)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
      setParsedJson(null)
    }
  }

  const sortJsonByValues = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input.trim())
      const sorted = sortObjectByValues(parsed)
      const formattedJson = JSON.stringify(sorted, null, indentSize)
      setFormatted(formattedJson)
      setParsedJson(sorted)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
      setParsedJson(null)
    }
  }

  return (
    <ClientToolLayout
      title="JSON Formatter"
      icon={FileText}
      iconColor="bg-purple-500"
      description="Format, validate, and manipulate JSON data"
      maxWidth="7xl"
    >
        {/* Controls */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={formatJson}
              className="btn-secondary dark:bg-gray-500 dark:text-white"
            >
              Format JSON
            </button>
            <button
              onClick={minifyJson}
              className="btn-secondary dark:bg-gray-500 dark:text-white"
            >
              Minify JSON
            </button>
            <button
              onClick={sortJsonByKeys}
              className="btn-secondary flex items-center dark:bg-gray-500 dark:text-white"
            >
              <SortAsc className="w-4 h-4 mr-2" />
              Sort by Keys
            </button>
            <button
              onClick={sortJsonByValues}
              className="btn-secondary flex items-center dark:bg-gray-500 dark:text-white"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort by Values
            </button>
            <button
              onClick={validateJson}
              className="btn-secondary dark:bg-gray-500 dark:text-white"
            >
              Validate JSON
            </button>
            <button
              onClick={loadSample}
              className="btn-secondary dark:bg-gray-500 dark:text-white"
            >
              Load Sample
            </button>
            <button
              onClick={clearAll}
              className="btn-secondary flex items-center dark:bg-gray-500 dark:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-white">Indent Size:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="input-field w-20"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div className={`rounded-lg p-4 mb-6 ${isValid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
            <div className="flex items-center">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
              )}
              <span className={`font-medium ${isValid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                }`}>
                {isValid ? 'Valid JSON' : 'Invalid JSON'}
              </span>
            </div>
            {error && (
              <p className="text-red-700 dark:text-red-300 text-sm mt-2">{error}</p>
            )}
          </div>
        )}

        {/* Side by Side Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="input" className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                JSON Input
              </label>
            </div>
            <div className="space-y-3">
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="input-field h-96 resize-none font-mono text-sm w-full dark:bg-gray-500 dark:text-white"
              />
              {input && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-32 overflow-auto">
                  <div className="text-xs text-gray-600 dark:text-white mb-2">Preview:</div>
                  <SyntaxHighlighter
                    language="json"
                    style={tomorrow}
                    customStyle={{
                      background: 'transparent',
                      padding: '0',
                      margin: '0',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    }}
                    showLineNumbers={false}
                    wrapLines={true}
                  >
                    {input}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {formatted ? 'Formatted Result' : 'Result will appear here'}
              </h3>
              {formatted && (
                <button
                  onClick={() => copyToClipboard(formatted)}
                  className="btn-secondary flex items-center text-sm dark:bg-gray-500 dark:text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-500 rounded-lg p-4 h-96 overflow-auto">
              {formatted ? (
                <SyntaxHighlighter
                  language="json"
                  style={tomorrow}
                  customStyle={{
                    background: 'transparent',
                    padding: '0',
                    margin: '0',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {formatted}
                </SyntaxHighlighter>
              ) : (
                <div className="text-gray-500 dark:text-white text-center py-20">
                  Process JSON to see the formatted result
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-purple-900 dark:text-purple-200 mb-3">How it works</h3>
          <div className="text-purple-800 dark:text-purple-200 text-sm space-y-2">
            <p>
              <strong>Format JSON:</strong> Beautifies JSON with proper indentation and line breaks for better readability.
            </p>
            <p>
              <strong>Minify JSON:</strong> Removes all unnecessary whitespace to create compact JSON for production use.
            </p>
            <p>
              <strong>Sort by Keys:</strong> Recursively sorts all object properties alphabetically by key names throughout the JSON structure.
            </p>
            <p>
              <strong>Sort by Values:</strong> Recursively sorts all object properties by their values (converted to strings for comparison) throughout the JSON structure.
            </p>
            <p>
              <strong>Validate JSON:</strong> Checks if the input is valid JSON and shows any syntax errors.
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              <strong>Features:</strong> Supports custom indentation sizes, recursive sorting for nested objects,
              syntax highlighting, and error reporting for invalid JSON.
            </p>
          </div>
        </div>

      {/* Toast Notifications */}
      <Toaster />
    </ClientToolLayout>
  )
}
