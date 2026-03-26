'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const SKILLS = [
  { label: 'React', color: 'from-cyan-400 to-blue-500' },
  { label: 'Next.js', color: 'from-white to-gray-400' },
  { label: 'Python', color: 'from-yellow-400 to-green-500' },
  { label: 'AWS', color: 'from-orange-400 to-yellow-500' },
  { label: 'GenAI', color: 'from-violet-400 to-fuchsia-500' },
  { label: 'Docker', color: 'from-blue-400 to-cyan-500' },
  { label: 'TypeScript', color: 'from-blue-500 to-indigo-600' },
  { label: 'PyTorch', color: 'from-red-400 to-orange-500' },
  { label: 'Kubernetes', color: 'from-blue-500 to-purple-600' },
  { label: 'GCP', color: 'from-red-400 to-blue-500' },
  { label: 'LLMs', color: 'from-emerald-400 to-teal-500' },
  { label: 'Agentic AI', color: 'from-pink-400 to-rose-500' },
]

const TYPING_LINES = [
  { prompt: 'brad@resume:~$', text: ' whoami' },
  { prompt: '', text: 'Senior Software Engineer · Full-Stack Developer' },
  { prompt: '', text: '10+ years · AI/ML · Cloud-Native · GenAI' },
]

function TerminalTyping() {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [lines, setLines] = useState<string[]>([])
  const [currentText, setCurrentText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (lineIndex >= TYPING_LINES.length) return

    const line = TYPING_LINES[lineIndex]
    const fullText = line.text

    if (charIndex < fullText.length) {
      const speed = line.prompt ? 60 : 25
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + fullText[charIndex])
        setCharIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, (line.prompt ? line.prompt : '') + fullText])
        setCurrentText('')
        setCharIndex(0)
        setLineIndex(prev => prev + 1)
      }, line.prompt ? 400 : 200)
      return () => clearTimeout(timeout)
    }
  }, [lineIndex, charIndex])

  return (
    <div className="font-mono text-sm sm:text-base leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className={TYPING_LINES[i]?.prompt ? 'text-emerald-400' : 'text-gray-300'}>
          {TYPING_LINES[i]?.prompt && (
            <span className="text-emerald-400">{TYPING_LINES[i].prompt}</span>
          )}
          <span className={TYPING_LINES[i]?.prompt ? 'text-white' : 'text-gray-300'}>
            {line.replace(TYPING_LINES[i]?.prompt || '', '')}
          </span>
        </div>
      ))}
      {lineIndex < TYPING_LINES.length && (
        <div>
          {TYPING_LINES[lineIndex].prompt && (
            <span className="text-emerald-400">{TYPING_LINES[lineIndex].prompt}</span>
          )}
          <span className={TYPING_LINES[lineIndex].prompt ? 'text-white' : 'text-gray-300'}>
            {currentText}
          </span>
          <span className={`inline-block w-2.5 h-5 align-middle -mt-0.5 ml-0.5 ${showCursor ? 'bg-emerald-400' : 'bg-transparent'}`} />
        </div>
      )}
      {lineIndex >= TYPING_LINES.length && (
        <div>
          <span className="text-emerald-400">brad@resume:~$</span>
          <span className={`inline-block w-2.5 h-5 align-middle -mt-0.5 ml-1 ${showCursor ? 'bg-emerald-400' : 'bg-transparent'}`} />
        </div>
      )}
    </div>
  )
}

function FloatingSkills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {SKILLS.map((skill, i) => (
        <span
          key={skill.label}
          className={`
            inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
            bg-gradient-to-r ${skill.color} text-white
            shadow-lg shadow-black/20
            transition-all duration-700 ease-out
            hover:scale-110 hover:shadow-xl hover:shadow-black/30
            cursor-default select-none
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          {skill.label}
        </span>
      ))}
    </div>
  )
}

export function ResumeHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative mb-16 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 dark:from-emerald-500/10 dark:via-transparent dark:to-violet-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/8 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Terminal Card */}
        <div className={`
          rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden
          bg-gray-900 shadow-2xl shadow-black/20 dark:shadow-black/50
          transition-all duration-1000 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}>
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-gray-700/50">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-gray-400 font-mono">brad@resume — zsh</span>
          </div>
          {/* Terminal body */}
          <div className="p-5 sm:p-6">
            <TerminalTyping />
          </div>
        </div>

        {/* Name + headline */}
        <div className={`
          text-center space-y-4
          transition-all duration-1000 delay-500 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent">
              Brad Luo
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Building robust, scalable, cloud-native applications with a strong
            <span className="font-semibold text-foreground"> GenAI edge</span> —
            integrating LLMs, Agentic AI workflows, and ML capabilities into production systems.
          </p>
        </div>

        {/* Floating skill badges */}
        <div className={`
          transition-all duration-1000 delay-700 ease-out
          ${mounted ? 'opacity-100' : 'opacity-0'}
        `}>
          <FloatingSkills />
        </div>

        {/* CTA + Social links */}
        <div className={`
          flex flex-col sm:flex-row items-center justify-center gap-4
          transition-all duration-1000 delay-1000 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <Link
            href="https://resume.bradluo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl
              bg-gradient-to-r from-emerald-500 to-cyan-500
              text-white font-semibold text-sm sm:text-base
              shadow-lg shadow-emerald-500/25
              hover:shadow-xl hover:shadow-emerald-500/30
              hover:scale-105 active:scale-100
              transition-all duration-200
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View Full Resume
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/brad-luo"
              target="_blank"
              rel="noopener noreferrer"
              className="
                p-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110
                transition-all duration-200 shadow-sm
              "
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/xiaole-brad-luo/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                p-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110
                transition-all duration-200 shadow-sm
              "
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Link>
            <Link
              href="mailto:xiaoleluo2@gmail.com"
              className="
                p-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110
                transition-all duration-200 shadow-sm
              "
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
