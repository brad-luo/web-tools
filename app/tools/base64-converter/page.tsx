'use client'

import { useState } from 'react'
import { Copy, RotateCcw, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ClientToolLayout from '../../../components/ClientToolLayout'

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
      <div className="space-y-6">
        <Tabs defaultValue={mode} onValueChange={(value) => handleModeChange(value as 'encode' | 'decode')} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
            <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Text Input</CardTitle>
                <CardDescription>Enter the text you want to encode to Base64</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encode-input">Text to Encode</Label>
                  <Textarea
                    id="encode-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to convert to Base64..."
                    className="min-h-[120px] resize-none"
                  />
                </div>
                <div className="flex justify-between">
                  <Button onClick={handleEncode} disabled={!input.trim()}>
                    <Code2 className="w-4 h-4 mr-2" />
                    Encode
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {encoded && (
              <Card>
                <CardHeader>
                  <CardTitle>Base64 Result</CardTitle>
                  <CardDescription>Your encoded Base64 string</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-4">
                      <code className="text-sm break-all">{encoded}</code>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(encoded)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="decode" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Base64 Input</CardTitle>
                <CardDescription>Enter the Base64 string you want to decode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decode-input">Base64 to Decode</Label>
                  <Textarea
                    id="decode-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Base64 string to decode..."
                    className="min-h-[120px] resize-none"
                  />
                </div>
                <div className="flex justify-between">
                  <Button onClick={handleDecode} disabled={!input.trim()}>
                    <Code2 className="w-4 h-4 mr-2" />
                    Decode
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {decoded && (
              <Card>
                <CardHeader>
                  <CardTitle>Decoded Result</CardTitle>
                  <CardDescription>Your decoded text</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-4">
                      <code className="text-sm break-all">{decoded}</code>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(decoded)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-green-800 dark:text-green-200 text-sm space-y-2">
            <p>
              <strong>Base64 Encoding:</strong> Converts text into a format that uses only 64 characters (A-Z, a-z, 0-9, +, /).
              This is useful for transmitting binary data as text.
            </p>
            <p>
              <strong>Base64 Decoding:</strong> Converts Base64-encoded text back to its original form.
            </p>
            <p>
              <strong>Common Uses:</strong> Embedding images in HTML/CSS, encoding binary data in JSON,
              and data transmission in various protocols.
            </p>
          </CardContent>
        </Card>
      </div>
    </ClientToolLayout>
  )
}
