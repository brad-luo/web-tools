'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, RotateCcw, Link as LinkIcon } from 'lucide-react'

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const encodeUrl = (text: string) => {
    try {
      // Only encode the path and query parts, not the entire URL
      if (text.includes('://')) {
        const url = new URL(text)
        const encodedPath = encodeURIComponent(url.pathname)
        const encodedSearch = url.search ? '?' + encodeURIComponent(url.search.slice(1)) : ''
        return url.protocol + '//' + url.host + encodedPath + encodedSearch
      } else {
        return encodeURIComponent(text)
      }
    } catch {
      return encodeURIComponent(text)
    }
  }

  const decodeUrl = (text: string) => {
    try {
      return decodeURIComponent(text)
    } catch {
      return 'Invalid URL encoding'
    }
  }

  const handleEncode = () => {
    if (input.trim()) {
      const result = encodeUrl(input.trim())
      setEncoded(result)
    }
  }

  const handleDecode = () => {
    if (input.trim()) {
      const result = decodeUrl(input.trim())
      setDecoded(result)
    }
  }

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode)
    setInput('')
    setEncoded('')
    setDecoded('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearAll = () => {
    setInput('')
    setEncoded('')
    setDecoded('')
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
              <LinkIcon className="w-6 h-6 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">URL Encoder/Decoder</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleModeChange('encode')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mode === 'encode'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Encode
            </button>
            <button
              onClick={() => handleModeChange('decode')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mode === 'decode'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'Text to Decode'}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter encoded text to decode...'}
            className="input-field h-32 resize-none"
          />
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={mode === 'encode' ? handleEncode : handleDecode}
              className="btn-primary"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
            <button
              onClick={clearAll}
              className="btn-secondary flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Result Section */}
        {mode === 'encode' && encoded && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Encoded Result</h3>
              <button
                onClick={() => copyToClipboard(encoded)}
                className="btn-secondary flex items-center text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-800 break-all">{encoded}</code>
            </div>
          </div>
        )}

        {mode === 'decode' && decoded && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Decoded Result</h3>
              <button
                onClick={() => copyToClipboard(decoded)}
                className="btn-secondary flex items-center text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-800 break-all">{decoded}</code>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">How it works</h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p>
              <strong>Encode:</strong> Converts special characters in URLs to their percent-encoded equivalents.
              This tool intelligently handles full URLs by only encoding the path and query components.
            </p>
            <p>
              <strong>Decode:</strong> Converts percent-encoded characters back to their original form.
            </p>
            <p className="text-blue-700">
              <strong>Note:</strong> When encoding URLs, the protocol and hostname are preserved as-is,
              while only the path and query parameters are encoded.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
