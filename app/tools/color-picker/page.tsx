'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, RotateCcw, Palette } from 'lucide-react'

interface ColorFormats {
  hex: string
  rgb: string
  hsl: string
  cmyk: string
}

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [formats, setFormats] = useState<ColorFormats>({
    hex: '#3b82f6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    cmyk: 'cmyk(76%, 47%, 0%, 4%)'
  })

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }

  const rgbToCmyk = (r: number, g: number, b: number): [number, number, number, number] => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, g, b)
    const c = (1 - r - k) / (1 - k)
    const m = (1 - g - k) / (1 - k)
    const y = (1 - b - k) / (1 - k)

    return [
      Math.round(c * 100),
      Math.round(m * 100),
      Math.round(y * 100),
      Math.round(k * 100)
    ]
  }

  const updateFormats = (hex: string) => {
    const [r, g, b] = hexToRgb(hex)
    const [h, s, l] = rgbToHsl(r, g, b)
    const [c, m, y, k] = rgbToCmyk(r, g, b)

    setFormats({
      hex: hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      cmyk: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
    })
  }

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex)
    updateFormats(hex)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    handleColorChange(randomHex)
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
              <Palette className="w-6 h-6 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Color Picker & Converter</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Color Picker Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color Picker</h3>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center space-y-4">
              <div
                className="w-32 h-32 rounded-lg shadow-lg border-2 border-gray-200"
                style={{ backgroundColor: selectedColor }}
              />
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-12 border-0 rounded cursor-pointer"
              />
              <button
                onClick={generateRandomColor}
                className="btn-secondary text-sm"
              >
                Random Color
              </button>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formats).map(([format, value]) => (
                  <div key={format} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 uppercase">{format}</span>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <code className="text-sm text-gray-800 break-all">{value}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'].map((color) => (
              <div key={color} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
                <span className="text-xs text-gray-600 mt-2 font-mono">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-pink-900 mb-3">How it works</h3>
          <div className="text-pink-800 text-sm space-y-2">
            <p>
              <strong>Color Picker:</strong> Use the color picker to select any color, or click on preset colors in the palette.
            </p>
            <p>
              <strong>Format Conversion:</strong> Automatically converts between HEX, RGB, HSL, and CMYK color formats.
            </p>
            <p>
              <strong>Copy Values:</strong> Click the copy icon next to any color format to copy it to your clipboard.
            </p>
            <p className="text-pink-700">
              <strong>Features:</strong> Real-time conversion, random color generation, and a curated color palette for inspiration.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
