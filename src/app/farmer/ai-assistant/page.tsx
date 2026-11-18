'use client'

import { useState } from 'react'
import { Bot, Send, Sparkles, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { chatFarmerAssistant } from '@/lib/actions/ai'

export default function FarmerAIAssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `আসসালামু আলাইকুম! আমি CropConnect এআই কৃষি পরামর্শক।
আপনি আমাকে যেকোনো কৃষি বিষয়ক প্রশ্ন করতে পারেন:
• ফসলের সঠিক লিস্টিং তৈরি ও দাম নির্ধারণ
• আমন ও বোরো ধানের বর্তমান বাজার প্রবণতা
• ফলন পরবর্তী সংরক্ষণ ও প্যাকেজিং পদ্ধতি
• ক্রেতার সাথে নিরাপদ লেনদেনের নিয়মাবলি

কীভাবে আপনাকে সাহায্য করতে পারি?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickTopics = [
    'আলুর সঠিক হিমাগার সংরক্ষণ পদ্ধতি কী?',
    'পেঁয়াজের দাম কখন বাড়ার সম্ভাবনা থাকে?',
    'কীটনাশক ব্যবহারের সুরক্ষা নিয়ম কী?',
    'অর্ডারের পর কীভাবে মাল ডেলিভারি করব?'
  ]

  const handleSend = async (text?: string) => {
    const q = text || input
    if (!q.trim() || loading) return

    const updated = [...messages, { role: 'user' as const, content: q }]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await chatFarmerAssistant(updated)
      setMessages([...updated, { role: 'assistant', content: res.reply }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'সার্ভারে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">
            AI Farmer Assistant (কৃষি এআই পরামর্শক)
          </h1>
          <Badge variant="accent" className="font-bold">Bangla-First</Badge>
        </div>
        <p className="text-xs text-slate-500">
          Intelligent assistant designed specifically for rural Bangladeshi agricultural producers.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>কৃষি নিরাপত্তা নীতি:</strong> CropConnect এআই ফসল উৎপাদন ও বিপণন বিষয়ক সাধারণ নির্দেশিকা প্রদান করে। সংকটময় রোগের চিকিৎসায় রাসায়নিক মাত্রা নির্ধারণের জন্য সর্বদা উপজেলা কৃষি সম্প্রসারণ কর্মকর্তা (DAE) বা সরকারি হেল্পলাইন <strong>১৬১২৩</strong>-এ যোগাযোগ করুন।
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  AI
                </div>
              )}
              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[85%] whitespace-pre-line shadow-xs ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-500 italic">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
              <span>এআই উত্তর বিশ্লেষণ ও তৈরি করছে...</span>
            </div>
          )}
        </div>

        {/* Quick prompt pill chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {quickTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSend(topic)}
              className="px-3 py-1.5 rounded-full text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap border border-emerald-200/70"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="আপনার প্রশ্ন বাংলায় অথবা ইংরেজিতে লিখুন..."
            className="flex-1 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Button
            variant="default"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="rounded-2xl px-5 font-bold"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
