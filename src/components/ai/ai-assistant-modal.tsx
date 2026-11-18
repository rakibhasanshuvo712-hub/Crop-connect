'use client'

import { useState } from 'react'
import { Bot, Send, Sparkles, X, User, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { chatFarmerAssistant } from '@/lib/actions/ai'

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'আসসালামু আলাইকুম! আমি কৃষিবাজার এআই কৃষি সহকারী। ফসল লিস্টিং, বাজারদর, অথবা ক্রেতার অর্ডার ব্যবস্থাপনা নিয়ে কোনো প্রশ্ন থাকলে আমাকে জানাতে পারেন।'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickPrompts = [
    'পণ্য কীভাবে যোগ করব?',
    'বর্তমান আমন চালের বাজারদর কত?',
    'কীটনাশকের সঠিক ব্যবহার?',
    'অর্ডার কীভাবে গ্রহণ করব?'
  ]

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim() || loading) return

    const newMsgs = [...messages, { role: 'user' as const, content: text }]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      const res = await chatFarmerAssistant(newMsgs)
      setMessages([...newMsgs, { role: 'assistant', content: res.reply }])
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'দুঃখিত, কোনো সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
        title="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        </div>
        <span className="text-xs sm:text-sm font-bold hidden sm:inline">কৃষি AI সহকারী</span>
      </button>

      {/* Slide-in Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:p-6 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[90vh] sm:h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm">কৃষিবাজার এআই সহকারী</h3>
                    <Badge variant="accent" className="text-[10px] py-0 px-1.5">বাংলা</Badge>
                  </div>
                  <p className="text-[11px] text-emerald-100">Smart Agricultural & Market Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Safety Disclaimer Banner */}
            <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>কৃষি সম্প্রসারণ নীতিমালার অধীনে সহায়তামূলক এআই।</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                      AI
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs max-w-[82%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs whitespace-pre-line'
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  <span>এআই উত্তর তৈরি করছে...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200/60"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="আপনার কৃষি বিষয়ক প্রশ্ন লিখুন..."
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="rounded-xl px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
