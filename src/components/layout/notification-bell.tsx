'use client'

import { useState } from 'react'
import { Bell, Check, ShoppingBag, Truck, AlertTriangle, MessageSquare, Info, X } from 'lucide-react'
import Link from 'next/link'

interface NotificationItem {
  id: string
  title: string
  titleBn: string
  message: string
  messageBn: string
  type: 'order' | 'stock' | 'inquiry' | 'system'
  time: string
  read: boolean
  link?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Purchase Order Received',
    titleBn: 'নতুন ক্রয়ের অর্ডার এসেছে',
    message: 'Shwapno Super Shop ordered 500 kg of Aman Dhan (Miniket).',
    messageBn: 'স্বপ্ন সুপারশপ ৫০০ কেজি আমন ধান (মিনিকেট) অর্ডার করেছেন।',
    type: 'order',
    time: '১০ মিনিট আগে',
    read: false,
    link: '/farmer/orders'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    titleBn: 'মজুদ স্বল্পতার সতর্কতা',
    message: 'Your Diamond Potato listing has only 200 kg remaining.',
    messageBn: 'আপনার ডায়মন্ড আলুর মজুদে মাত্র ২০০ কেজি অবশিষ্ট আছে।',
    type: 'stock',
    time: '১ ঘন্টা আগে',
    read: false,
    link: '/farmer/products'
  },
  {
    id: 'notif-3',
    title: 'Buyer Inquiry',
    titleBn: 'ক্রেতার নতুন বার্তা',
    message: 'Agora Agro inquired about bulk delivery discount for Onion.',
    messageBn: 'আগোরা এগ্রো দেশি পেঁয়াজের পাইকারি ছাড় সম্পর্কে জানতে চেয়েছেন।',
    type: 'inquiry',
    time: '৩ ঘন্টা আগে',
    read: true,
    link: '/farmer/inquiries'
  },
  {
    id: 'notif-4',
    title: 'Order Status Updated',
    titleBn: 'অর্ডার স্ট্যাটাস আপডেট',
    message: 'Order #ORD-8821 is now marked as Ready for Delivery.',
    messageBn: 'অর্ডার #ORD-8821 এখন "ডেলিভারির জন্য প্রস্তুত" অবস্থায় রয়েছে।',
    type: 'order',
    time: 'গতকাল',
    read: true,
    link: '/buyer/orders'
  }
]

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markItemRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? ({ ...n, read: true }) : n))
  }

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-emerald-600" />
      case 'stock':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case 'inquiry':
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Notifications (নোটিফিকেশন)</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications at this time.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemRead(item.id)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                    !item.read ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${!item.read ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.titleBn}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {item.messageBn}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setOpen(false)}
                        className="inline-block text-[10px] font-bold text-emerald-700 hover:underline mt-1"
                      >
                        বিস্তারিত দেখুন →
                      </Link>
                    )}
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
