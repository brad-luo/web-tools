'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, RotateCcw, Type } from 'lucide-react'

export default function TextConverter() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})

  const convertText = () => {
    if (!input.trim()) return

    const text = input.trim()
    const conversions = {
      'UPPERCASE': text.toUpperCase(),
      'lowercase': text.toLowerCase(),
      'Title Case': text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      'camelCase': text.replace(/\s+(.)/g, (match, group) => group.toUpperCase()).replace(/\s+/g, '').replace(/^(.)/, (match) => match.toLowerCase()),
      'PascalCase': text.replace(/\s+(.)/g, (match, group) => group.toUpperCase()).replace(/\s+/g, '').replace(/^(.)/, (match) => match.toUpperCase()),
      'snake_case': text.replace(/\s+/g, '_').toLowerCase(),
      'kebab-case': text.replace(/\s+/g, '-').toLowerCase(),
      'Sentence case': text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      'aNtIcAsE': text.split('').map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join(''),
      'ReVeRsE': text.split('').reverse().join('')
    }

    setResults(conversions)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearAll = () => {
    setInput('')
    setResults({})
  }

  const loadSample = () => {
    const sample = 'hello world example text'
    setInput(sample)
    setResults({})
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
              <Type className="w-6 h-6 text-orange-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Text Case Converter</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={convertText}
              className="btn-primary"
            >
              Convert Text
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
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Text to Convert
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert between different cases..."
            className="input-field h-32 resize-none"
          />
        </div>

        {/* Results Section */}
        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Converted Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results).map(([caseType, result]) => (
                <div key={caseType} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{caseType}</span>
                    <button
                      onClick={() => copyToClipboard(result)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <code className="text-sm text-gray-800 break-all">{result}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-orange-900 mb-3">Available Conversions</h3>
          <div className="text-orange-800 text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div><strong>UPPERCASE:</strong> All letters in uppercase</div>
              <div><strong>lowercase:</strong> All letters in lowercase</div>
              <div><strong>Title Case:</strong> First letter of each word capitalized</div>
              <div><strong>camelCase:</strong> First word lowercase, others capitalized</div>
              <div><strong>PascalCase:</strong> First letter of each word capitalized</div>
              <div><strong>snake_case:</strong> Words separated by underscores</div>
              <div><strong>kebab-case:</strong> Words separated by hyphens</div>
              <div><strong>Sentence case:</strong> First letter capitalized</div>
              <div><strong>aNtIcAsE:</strong> Alternating case letters</div>
              <div><strong>ReVeRsE:</strong> Text reversed</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
