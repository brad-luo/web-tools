'use client'

import { useState, useEffect } from 'react'
import { Copy, RotateCcw, Link as LinkIcon, ArrowRight } from 'lucide-react'
import ClientToolLayout from '@/components/ClientToolLayout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const encodeUrl = (text: string) => {
    try {
      // Check if it's a complete URL with protocol
      if (text.includes('://')) {
        const url = new URL(text)

        // Encode path segments individually (preserving '/' separators)
        const pathSegments = url.pathname.split('/').map(segment =>
          segment ? encodeURIComponent(segment) : segment
        )
        const encodedPath = pathSegments.join('/')

        // Encode query parameters (preserving structure)
        let encodedSearch = ''
        if (url.search) {
          const params = new URLSearchParams(url.search)
          const encodedParams = new URLSearchParams()

          params.forEach((value, key) => {
            encodedParams.append(encodeURIComponent(key), encodeURIComponent(value))
          })

          encodedSearch = '?' + encodedParams.toString()
        }

        // Encode fragment (preserving '#' separator)
        const encodedHash = url.hash ? '#' + encodeURIComponent(url.hash.slice(1)) : ''

        // Reconstruct URL (protocol, host, port stay unchanged)
        return url.protocol + '//' + url.host + encodedPath + encodedSearch + encodedHash

      } else if (text.includes('/') && !text.includes('?') && !text.includes('#')) {
        // Looks like a path - encode segments individually
        const segments = text.split('/').map(segment =>
          segment ? encodeURIComponent(segment) : segment
        )
        return segments.join('/')

      } else if (text.includes('?') || text.includes('&') || text.includes('=')) {
        // Looks like query parameters - encode keys and values
        try {
          const params = new URLSearchParams(text.startsWith('?') ? text.slice(1) : text)
          const encodedParams = new URLSearchParams()

          params.forEach((value, key) => {
            encodedParams.append(encodeURIComponent(key), encodeURIComponent(value))
          })

          return (text.startsWith('?') ? '?' : '') + encodedParams.toString()
        } catch {
          return encodeURIComponent(text)
        }

      } else {
        // Plain text or single component - encode fully
        return encodeURIComponent(text)
      }
    } catch {
      // Fallback to basic encoding
      return encodeURIComponent(text)
    }
  }

  const decodeUrl = (text: string) => {
    try {
      // Check if it's a complete URL with protocol
      if (text.includes('://')) {
        // For complete URLs, decode each component carefully
        const parts = text.split('://')
        if (parts.length !== 2) return decodeURIComponent(text)

        const [protocol, rest] = parts
        const [hostAndPort, ...pathParts] = rest.split('/')

        if (pathParts.length === 0) {
          // Just protocol and host
          return protocol + '://' + hostAndPort
        }

        const pathAndQuery = pathParts.join('/')
        const [pathPart, ...queryAndFragment] = pathAndQuery.split('?')

        // Decode path segments
        const decodedPath = pathPart.split('/').map(segment =>
          segment ? decodeURIComponent(segment) : segment
        ).join('/')

        let result = protocol + '://' + hostAndPort + '/' + decodedPath

        if (queryAndFragment.length > 0) {
          const queryPart = queryAndFragment.join('?')
          const [queryString, ...fragmentParts] = queryPart.split('#')

          // Decode query parameters
          if (queryString) {
            try {
              const params = new URLSearchParams(queryString)
              const decodedParams = new URLSearchParams()

              params.forEach((value, key) => {
                decodedParams.append(decodeURIComponent(key), decodeURIComponent(value))
              })

              result += '?' + decodedParams.toString()
            } catch {
              result += '?' + decodeURIComponent(queryString)
            }
          }

          // Decode fragment
          if (fragmentParts.length > 0) {
            const fragment = fragmentParts.join('#')
            result += '#' + decodeURIComponent(fragment)
          }
        }

        return result

      } else {
        // For partial URLs or plain text, decode directly
        return decodeURIComponent(text)
      }
    } catch (error) {
      return 'Invalid URL encoding: ' + (error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Real-time conversion effect
  useEffect(() => {
    if (input.trim()) {
      if (mode === 'encode') {
        setOutput(encodeUrl(input.trim()))
      } else {
        setOutput(decodeUrl(input.trim()))
      }
    } else {
      setOutput('')
    }
  }, [input, mode])

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode)
    setInput('')
    setOutput('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  return (
    <ClientToolLayout
      title="URL Encoder/Decoder"
      icon={LinkIcon}
      iconColor="bg-blue-500"
      description="Smart URL encoding that only encodes necessary parts according to RFC 3986 standards"
      maxWidth="6xl"
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              onClick={() => handleModeChange('encode')}
              variant={mode === 'encode' ? 'default' : 'ghost'}
              className={`flex-1 ${mode === 'encode' ? '' : 'text-muted-foreground'}`}
            >
              Encode
            </Button>
            <Button
              onClick={() => handleModeChange('decode')}
              variant={mode === 'decode' ? 'default' : 'ghost'}
              className={`flex-1 ${mode === 'decode' ? '' : 'text-muted-foreground'}`}
            >
              Decode
            </Button>
          </div>
        </div>

        {/* Main conversion area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="input" className="text-sm font-medium text-foreground">
                {mode === 'encode' ? 'Text to Encode' : 'Text to Decode'}
              </label>
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter encoded text to decode...'}
              className="min-h-[300px] resize-none font-mono"
            />
            {input && (
              <p className="text-xs text-muted-foreground mt-2">
                {input.length} characters
              </p>
            )}
          </div>

          {/* Output */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
              </label>
              {output && (
                <Button
                  onClick={() => copyToClipboard(output)}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
            <div className="min-h-[300px] bg-muted rounded-md p-3 border">
              {output ? (
                <pre className="text-sm font-mono whitespace-pre-wrap break-all text-foreground">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <ArrowRight className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Result will appear here</p>
                  </div>
                </div>
              )}
            </div>
            {output && (
              <p className="text-xs text-muted-foreground mt-2">
                {output.length} characters
              </p>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">How it works</h3>
          <div className="text-blue-800 dark:text-blue-200 text-sm space-y-3">
            <div>
              <p><strong className="text-blue-600 dark:text-blue-400">Smart Encoding:</strong> Only encodes the parts that need it according to RFC 3986 standards:</p>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li><strong>Path segments:</strong> Encodes special characters while preserving `/` separators</li>
                <li><strong>Query parameters:</strong> Encodes keys and values while preserving `?`, `&`, and `=`</li>
                <li><strong>Fragments:</strong> Encodes content after `#` while preserving the `#` symbol</li>
              </ul>
            </div>

            <div>
              <p><strong className="text-green-600 dark:text-green-400">What stays unchanged:</strong></p>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>Protocol (http://, https://)</li>
                <li>Domain names and ports</li>
                <li>URL structure delimiters</li>
              </ul>
            </div>

            <div>
              <p><strong className="text-purple-600 dark:text-purple-400">Real-time:</strong> Conversion happens automatically as you type - no need to click buttons.</p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-3">
              <p><strong className="text-blue-700 dark:text-blue-300">Examples:</strong></p>
              <p className="font-mono text-xs mt-1">
                <span className="text-green-700 dark:text-green-400">✓</span> `https://example.com/my file.txt` → `https://example.com/my%20file.txt`<br />
                <span className="text-green-700 dark:text-green-400">✓</span> `search?q=hello world&type=web` → `search?q=hello%20world&type=web`<br />
                <span className="text-green-700 dark:text-green-400">✓</span> `#section 1` → `#section%201`
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientToolLayout>
  )
}
