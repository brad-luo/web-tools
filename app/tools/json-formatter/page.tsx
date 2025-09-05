'use client'

import { useState } from 'react'
import { Copy, RotateCcw, FileText, CheckCircle, XCircle, ArrowUpDown, SortAsc, Code2 } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ClientToolLayout from '@/components/ClientToolLayout'

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
      <div className="space-y-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>JSON Operations</CardTitle>
            <CardDescription>Format, validate, and manipulate your JSON data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Primary Actions */}
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Primary Actions
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={formatJson}
                    disabled={!input.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Format
                  </Button>
                  <Button
                    onClick={minifyJson}
                    disabled={!input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Minify
                  </Button>
                  <Button
                    onClick={validateJson}
                    disabled={!input.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validate
                  </Button>
                </div>
              </div>

              {/* Sorting Actions */}
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Sorting Options
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={sortJsonByKeys}
                    disabled={!input.trim()}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950 dark:hover:text-orange-300"
                  >
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort by Keys
                  </Button>
                  <Button
                    onClick={sortJsonByValues}
                    disabled={!input.trim()}
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950 dark:hover:text-amber-300"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort by Values
                  </Button>
                </div>
              </div>

              {/* Utility Actions */}
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Utilities
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={loadSample}
                    variant="secondary"
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                  >
                    Load Sample
                  </Button>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Indent Size:</Label>
              <Select value={indentSize.toString()} onValueChange={(value) => setIndentSize(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        {isValid !== null && (
          <Card className={isValid
            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50'
            : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50'
          }>
            <CardContent className="p-4">
              <div className="flex items-center">
                {isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                )}
                <span className={`font-medium ${isValid
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'}`}>
                  {isValid ? 'Valid JSON' : 'Invalid JSON'}
                </span>
              </div>
              {error && (
                <p className="text-red-700 dark:text-red-300 text-sm mt-2 ml-7">{error}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Side by Side Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>JSON Input</CardTitle>
              <CardDescription>Paste your JSON data here to format or validate</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1">
                <Label htmlFor="json-input" className="text-sm font-medium mb-2 block">JSON Data</Label>
                <Textarea
                  id="json-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="min-h-[500px] resize-none font-mono text-sm"
                />
              </div>
              {input && (
                <div className="text-xs text-muted-foreground mt-2">
                  {input.length} characters • {input.split('\n').length} lines
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {formatted ? 'Formatted Result' : 'Result'}
                  </CardTitle>
                  <CardDescription>
                    {formatted ? 'Your processed JSON output' : 'Results will appear here after processing'}
                  </CardDescription>
                </div>
                {formatted && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formatted)}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="bg-muted rounded-lg p-4 flex-1 overflow-auto">
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
                  <div className="text-muted-foreground text-center flex items-center justify-center h-full">
                    <div>
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Process JSON to see the formatted result</p>
                    </div>
                  </div>
                )}
              </div>
              {formatted && (
                <div className="text-xs text-muted-foreground mt-2">
                  {formatted.length} characters • {formatted.split('\n').length} lines
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-purple-800 dark:text-purple-200 text-sm space-y-3">
            <div className="space-y-2">
              <p><strong className="text-purple-600 dark:text-purple-400">Format JSON:</strong> Beautifies JSON with proper indentation and line breaks for better readability.</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Minify JSON:</strong> Removes all unnecessary whitespace to create compact JSON for production use.</p>
              <p><strong className="text-green-600 dark:text-green-400">Validate JSON:</strong> Checks if the input is valid JSON and shows any syntax errors.</p>
              <p><strong className="text-orange-600 dark:text-orange-400">Sort by Keys:</strong> Recursively sorts all object properties alphabetically by key names throughout the JSON structure.</p>
              <p><strong className="text-amber-600 dark:text-amber-400">Sort by Values:</strong> Recursively sorts all object properties by their values (converted to strings for comparison) throughout the JSON structure.</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/50 rounded-lg p-3 mt-4">
              <p><strong className="text-purple-700 dark:text-purple-300">Features:</strong> Supports custom indentation sizes, recursive sorting for nested objects, syntax highlighting, and comprehensive error reporting for invalid JSON.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </ClientToolLayout>
  )
}
