'use client'

import { create } from 'zustand'
import type { ModelId } from '@/lib/ai/models'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  isStreaming?: boolean
}

export type ConversationSummary = {
  id: string
  title: string
  model: string
  pinned: boolean
  updatedAt: string
}

interface ChatStore {
  // current chat
  conversationId: string | null
  messages: ChatMessage[]
  isStreaming: boolean
  currentModel: ModelId

  // history
  conversations: ConversationSummary[]
  conversationsLoaded: boolean

  // sidebar
  sidebarOpen: boolean

  // actions
  setConversationId: (id: string | null) => void
  setMessages: (messages: ChatMessage[]) => void
  appendMessage: (message: ChatMessage) => void
  updateLastMessage: (text: string) => void
  setStreaming: (streaming: boolean) => void
  setModel: (model: ModelId) => void

  setConversations: (conversations: ConversationSummary[]) => void
  upsertConversation: (conversation: ConversationSummary) => void
  removeConversation: (id: string) => void

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  reset: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversationId: null,
  messages: [],
  isStreaming: false,
  currentModel: 'ntrl-2.0',

  conversations: [],
  conversationsLoaded: false,

  sidebarOpen: true,

  setConversationId: (id) => set({ conversationId: id }),
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message] })),
  updateLastMessage: (text) =>
    set((s) => {
      const messages = [...s.messages]
      const last = messages[messages.length - 1]
      if (last && last.role === 'assistant') {
        messages[messages.length - 1] = { ...last, content: last.content + text }
      }
      return { messages }
    }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setModel: (currentModel) => set({ currentModel }),

  setConversations: (conversations) =>
    set({ conversations, conversationsLoaded: true }),
  upsertConversation: (c) =>
    set((s) => {
      const existing = s.conversations.find((x) => x.id === c.id)
      if (existing) {
        return {
          conversations: s.conversations
            .map((x) => (x.id === c.id ? { ...x, ...c } : x))
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
        }
      }
      return {
        conversations: [c, ...s.conversations].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
      }
    }),
  removeConversation: (id) =>
    set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id) })),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  reset: () => set({ conversationId: null, messages: [] }),
}))
