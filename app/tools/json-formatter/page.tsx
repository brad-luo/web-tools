'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, RotateCcw, FileText, CheckCircle, XCircle } from 'lucide-react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const formatJson = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input.trim())
      const formattedJson = JSON.stringify(parsed, null, indentSize)
      setFormatted(formattedJson)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
    }
  }

  const minifyJson = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input.trim())
      const minified = JSON.stringify(parsed)
      setFormatted(minified)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
    }
  }

  const validateJson = () => {
    if (!input.trim()) return

    try {
      JSON.parse(input.trim())
      setIsValid(true)
      setError('')
      setFormatted('')
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormatted('')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearAll = () => {
    setInput('')
    setFormatted('')
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
    setFormatted('')
    setIsValid(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Tools
            </Link>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-purple-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">JSON Formatter</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={formatJson}
              className="btn-primary"
            >
              Format JSON
            </button>
            <button
              onClick={minifyJson}
              className="btn-secondary"
            >
              Minify JSON
            </button>
            <button
              onClick={validateJson}
              className="btn-secondary"
            >
              Validate JSON
            </button>
            <button
              onClick={loadSample}
              className="btn-secondary"
            >
              Load Sample
            </button>
            <button
              onClick={clearAll}
              className="btn-secondary flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Indent Size:</label>
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

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            JSON Input
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="input-field h-64 resize-none font-mono text-sm"
          />
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div className={`rounded-lg p-4 mb-6 ${isValid
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
            }`}>
            <div className="flex items-center">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                {isValid ? 'Valid JSON' : 'Invalid JSON'}
              </span>
            </div>
            {error && (
              <p className="text-red-700 text-sm mt-2">{error}</p>
            )}
          </div>
        )}

        {/* Result Section */}
        {formatted && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Formatted Result</h3>
              <button
                onClick={() => copyToClipboard(formatted)}
                className="btn-secondary flex items-center text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap font-mono">
                {formatted}
              </pre>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-purple-900 mb-3">How it works</h3>
          <div className="text-purple-800 text-sm space-y-2">
            <p>
              <strong>Format JSON:</strong> Beautifies JSON with proper indentation and line breaks for better readability.
            </p>
            <p>
              <strong>Minify JSON:</strong> Removes all unnecessary whitespace to create compact JSON for production use.
            </p>
            <p>
              <strong>Validate JSON:</strong> Checks if the input is valid JSON and shows any syntax errors.
            </p>
            <p className="text-purple-700">
              <strong>Features:</strong> Supports custom indentation sizes, syntax highlighting,
              and error reporting for invalid JSON.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
