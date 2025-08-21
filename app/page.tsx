import Link from 'next/link'
import {
  Link as LinkIcon,
  FileText,
  Type,
  Palette,
  Code2,
  ArrowRight
} from 'lucide-react'

const tools = [
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL components like path and query parameters',
    icon: LinkIcon,
    href: '/tools/url-encoder',
    color: 'bg-blue-500'
  },
  {
    name: 'Base64 Converter',
    description: 'Convert text to and from Base64 encoding',
    icon: Code2,
    href: '/tools/base64-converter',
    color: 'bg-green-500'
  },
  {
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: FileText,
    href: '/tools/json-formatter',
    color: 'bg-purple-500'
  },
  {
    name: 'Text Case Converter',
    description: 'Convert text between different cases (UPPER, lower, Title)',
    icon: Type,
    href: '/tools/text-converter',
    color: 'bg-orange-500'
  },
  {
    name: 'Color Picker & Converter',
    description: 'Pick colors and convert between different color formats',
    icon: Palette,
    href: '/tools/color-picker',
    color: 'bg-pink-500'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Web Tools</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Useful online tools for developers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Essential Web Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A collection of useful online tools to help with common web development tasks.
            Simple, fast, and reliable tools you can use right in your browser.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href} className="group">
              <div className="tool-card group-hover:shadow-lg transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className={`${tool.color} p-3 rounded-lg text-white`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                      Try it now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Built with Next.js, Tailwind CSS, and ❤️
          </p>
        </div>
      </main>
    </div>
  )
}
