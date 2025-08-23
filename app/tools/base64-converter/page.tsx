'use client'

import { useState } from 'react'
import { Copy, RotateCcw, Code2 } from 'lucide-react'
import ClientToolLayout from '../../components/ClientToolLayout'

export default function Base64Converter() {
  const [input, setInput] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const encodeBase64 = (text: string) => {
    try {
      return btoa(unescape(encodeURIComponent(text)))
    } catch {
      return 'Error: Could not encode text'
    }
  }

  const decodeBase64 = (text: string) => {
    try {
      return decodeURIComponent(escape(atob(text)))
    } catch {
      return 'Error: Invalid Base64 string'
    }
  }

  const handleEncode = () => {
    if (input.trim()) {
      const result = encodeBase64(input.trim())
      setEncoded(result)
    }
  }

  const handleDecode = () => {
    if (input.trim()) {
      const result = decodeBase64(input.trim())
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
    <ClientToolLayout
      title="Base64 Converter"
      icon={Code2}
      iconColor="bg-green-500"
      description="Encode and decode text to/from Base64 format"
      maxWidth="4xl"
    >
        {/* Mode Toggle */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-500 p-1 rounded-lg">
            <button
              onClick={() => handleModeChange('encode')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mode === 'encode'
                  ? 'bg-white text-gray-900 dark:bg-gray-300 dark:text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200'
                }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => handleModeChange('decode')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mode === 'decode'
                  ? 'bg-white text-gray-900 dark:bg-gray-300 dark:text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200'
                }`}
            >
              Decode from Base64
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to convert to Base64...' : 'Enter Base64 string to decode...'}
            className="input-field h-32 resize-none dark:bg-gray-500 dark:text-white"
          />
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={mode === 'encode' ? handleEncode : handleDecode}
              className="btn-primary dark:bg-gray-500 dark:text-white"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
            <button
              onClick={clearAll}
              className="btn-secondary flex items-center dark:bg-gray-500 dark:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Result Section */}
        {mode === 'encode' && encoded && (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Base64 Result</h3>
              <button
                onClick={() => copyToClipboard(encoded)}
                className="btn-secondary flex items-center text-sm dark:bg-gray-500 dark:text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-500 rounded-lg p-4">
              <code className="text-sm text-gray-800 dark:text-white break-all">{encoded}</code>
            </div>
          </div>
        )}

        {mode === 'decode' && decoded && (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Decoded Result</h3>
              <button
                onClick={() => copyToClipboard(decoded)}
                className="btn-secondary flex items-center text-sm dark:bg-gray-500 dark:text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-500 rounded-lg p-4">
              <code className="text-sm text-gray-800 dark:text-white break-all">{decoded}</code>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 dark:text-green-200 mb-3">How it works</h3>
          <div className="text-green-800 dark:text-green-200 text-sm space-y-2">
            <p>
              <strong>Base64 Encoding:</strong> Converts text into a format that uses only 64 characters (A-Z, a-z, 0-9, +, /).
              This is useful for transmitting binary data as text.
            </p>
            <p>
              <strong>Base64 Decoding:</strong> Converts Base64-encoded text back to its original form.
            </p>
            <p className="text-green-700">
              <strong>Common Uses:</strong> Embedding images in HTML/CSS, encoding binary data in JSON,
              and data transmission in various protocols.
            </p>
          </div>
        </div>
    </ClientToolLayout>
  )
}
