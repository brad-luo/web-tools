'use client'

import { useState } from 'react'
import { Copy, RotateCcw, Type, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import ClientToolLayout from '@/components/ClientToolLayout'

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
    <ClientToolLayout
      title="Text Case Converter"
      icon={Type}
      iconColor="bg-orange-500"
      description="Convert text between different case formats"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
            <CardDescription>Enter the text you want to convert to different case formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Enter Text</Label>
              <Textarea
                id="text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to convert..."
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={convertText} disabled={!input.trim()}>
                <Type className="w-4 h-4 mr-2" />
                Convert Text
              </Button>
              <Button variant="outline" onClick={loadSample}>
                <Sparkles className="w-4 h-4 mr-2" />
                Load Sample
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Converted Results</CardTitle>
              <CardDescription>Your text converted to different case formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(results).map(([format, text]) => (
                  <div key={format} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{format}</Label>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(text)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <code className="text-sm break-all">{text}</code>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100">Available Conversions</CardTitle>
          </CardHeader>
          <CardContent className="text-orange-800 dark:text-orange-200 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>UPPERCASE:</strong> All letters in uppercase</p>
              <p><strong>lowercase:</strong> All letters in lowercase</p>
              <p><strong>Title Case:</strong> First letter of each word capitalized</p>
              <p><strong>camelCase:</strong> First word lowercase, others capitalized</p>
              <p><strong>PascalCase:</strong> First letter of each word capitalized</p>
              <p><strong>snake_case:</strong> Words separated by underscores</p>
              <p><strong>kebab-case:</strong> Words separated by hyphens</p>
              <p><strong>Sentence case:</strong> First letter capitalized</p>
              <p><strong>aNtIcAsE:</strong> Alternating case letters</p>
              <p><strong>ReVeRsE:</strong> Text reversed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientToolLayout>
  )
}
