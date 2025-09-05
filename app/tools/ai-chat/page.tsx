'use client'

import { useState, useMemo, useEffect } from 'react'
import { MessageCircle, Send, Trash2, Copy, RotateCcw, User, Bot, Settings } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport } from 'ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coldarkDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ClientToolLayout from '../../../components/ClientToolLayout'
import toast from 'react-hot-toast'

// Types for AI Chat configuration
interface AIModel {
  id: string
  name: string
  provider: string
  description?: string
}

interface SystemPrompt {
  id: string
  name: string
  prompt: string
}


export default function AIChat() {
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [messageLimit, setMessageLimit] = useState({ used: 0, remaining: 10, limit: 10 })
  const [models, setModels] = useState<AIModel[]>([])
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([])
  const [config, setConfig] = useState(null)

  const [input, setInput] = useState('')

  // Create transport that updates when model changes
  const transport = useMemo(() => new TextStreamChatTransport({
    api: '/api/chat',
    body: {
      model: selectedModel,
    },
  }), [selectedModel])

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    messages: [],
    id: `chat-${selectedModel}`, // Force reinit when model changes
    onError: (error) => {
      toast.error('Failed to send message. Please check your API keys in environment variables.')
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Fetch message limit on component mount
  useEffect(() => {
    fetch('/api/ai-chat/limit')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Failed to fetch message limit:', data.error)
        } else {
          setMessageLimit(data)
        }
      })
      .catch(err => console.error('Error fetching message limit:', err))
  }, [])

  // Load AI chat configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config/tool/ai-chat')
        if (response.ok) {
          const data = await response.json()
          const config = data.config
          setConfig(config)

          // Update models and system prompts from config
          if (config.models && config.models.length > 0) {
            setModels(config.models)
            // Set first model as default if none selected
            if (!selectedModel) {
              setSelectedModel(config.models[0].id)
            }
          }
          if (config.systemPrompts && config.systemPrompts.length > 0) {
            // Add custom option to system prompts
            const promptsWithCustom = [...config.systemPrompts, { id: 'custom', name: 'Custom', prompt: '' }]
            setSystemPrompts(promptsWithCustom)
            // Set first prompt as default if none selected
            if (!selectedPrompt) {
              setSelectedPrompt(config.systemPrompts[0].id)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load AI chat configuration:', error)
        toast.error('Failed to load AI chat configuration')
      }
    }

    loadConfig()
  }, [selectedModel, selectedPrompt])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Check if user has remaining messages
    if (messageLimit.remaining <= 0) {
      toast.error('Daily message limit reached. Try again tomorrow.')
      return
    }

    const userMessage = input.trim()
    setInput('')

    try {
      // Add system message if it's the first message and a non-default system prompt is selected
      if (messages.length === 0 && shouldShowSystemPrompt()) {
        await sendMessage({
          text: getCurrentSystemPrompt(),
        })
      }

      await sendMessage({
        text: userMessage,
      })

      // Update message limit after successful send
      setMessageLimit(prev => ({
        ...prev,
        used: prev.used + 1,
        remaining: Math.max(0, prev.remaining - 1)
      }))
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const copyMessage = (message: any) => {
    // Extract text content from message - handle both old and new message formats
    let content = ''
    if (message.parts) {
      // New format with parts
      const textPart = message.parts.find((part: any) => part.type === 'text') as any
      content = textPart?.text || ''
    } else {
      // Fallback to old format
      content = message.content || ''
    }
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }

  const getCurrentSystemPrompt = () => {
    if (selectedPrompt === 'custom') {
      return customPrompt
    }
    return systemPrompts.find(p => p.id === selectedPrompt)?.prompt || ''
  }

  const shouldShowSystemPrompt = () => {
    // Don't show system prompt if it's the default one
    const prompt = getCurrentSystemPrompt()
    return selectedPrompt !== 'default' && prompt.trim() !== ''
  }


  return (
    <ClientToolLayout
      title="AI Chat"
      icon={MessageCircle}
      iconColor="bg-blue-500"
      description="Chat with AI models including GPT-4 and Claude"
      maxWidth="4xl"
    >
      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full input-field"
              >
                {models.length > 0 ? models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                )) : (
                  <option value="">Loading models...</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                System Prompt
              </label>
              <select
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(e.target.value)}
                className="w-full input-field"
              >
                {systemPrompts.length > 0 ? systemPrompts.map((prompt) => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.name}
                  </option>
                )) : (
                  <option value="">Loading prompts...</option>
                )}
              </select>
            </div>
          </div>

          {selectedPrompt === 'custom' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom System Prompt
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom system prompt..."
                className="w-full input-field h-20"
              />
            </div>
          )}
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-card rounded-lg shadow-sm border border-border flex flex-col h-[600px]">
        {/* Header */}
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-foreground">Chat</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {models.find(m => m.id === selectedModel)?.name}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${messageLimit.remaining <= 2
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : messageLimit.remaining <= 5
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}>
              {messageLimit.remaining}/{messageLimit.limit} messages left today
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary flex items-center text-sm"
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </button>
            <button
              onClick={clearChat}
              className="btn-secondary flex items-center text-sm"
              disabled={messages.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.filter(m => m.role !== 'system').map((message) => {
            // Extract text content from message - handle both old and new message formats
            let content = ''
            if (message.parts) {
              // New format with parts
              const textPart = message.parts.find((part: any) => part.type === 'text') as any
              content = textPart?.text || ''
            } else {
              // Fallback to old format
              content = (message as any).content || ''
            }

            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-foreground'
                    }`}
                >
                  <div className="flex items-start space-x-2 mb-2">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    ) : (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="text-xs font-medium opacity-75">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {message.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            const isInline = !match

                            if (isInline) {
                              return (
                                <code
                                  className="bg-muted px-1 py-0.5 rounded text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              )
                            }

                            return (
                              <SyntaxHighlighter
                                style={prism as any}
                                language={match[1]}
                                PreTag="div"
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            )
                          }
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    )}
                  </div>
                  <button
                    onClick={() => copyMessage(message)}
                    className="mt-2 text-xs opacity-50 hover:opacity-75 flex items-center"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="text-sm text-muted-foreground">Thinking...</div>
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 input-field"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || messageLimit.remaining <= 0 || !selectedModel}
              className="btn-primary flex items-center px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-1" />
              {messageLimit.remaining <= 0 ? 'Limit Reached' : 'Send'}
            </button>
            {isLoading && (
              <button
                type="button"
                onClick={stop}
                className="btn-secondary px-4"
              >
                Stop
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-3">AI Chat Features</h3>
        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
          <p>
            <strong>Multiple AI Models:</strong> Choose between GPT-4, Claude, and other leading AI models.
          </p>
          <p>
            <strong>System Prompts:</strong> Use predefined prompts or create custom ones for specialized tasks.
          </p>
          <p>
            <strong>Markdown Support:</strong> Rich text formatting with code syntax highlighting in responses.
          </p>
          <p>
            <strong>Streaming Responses:</strong> Real-time message streaming for faster interactions.
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            <strong>Daily Limit:</strong> Each logged-in user can send up to 10 messages per day. The limit resets at midnight.
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            <strong>Requirements:</strong> Login required. API keys configured server-side for security.
          </p>
        </div>
      </div>
    </ClientToolLayout>
  )
}