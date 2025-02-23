"use client"

import { useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Project {
  id: string
  title: string
  description: string
  category: string
}

interface AIChatProps {
  projectDetails: {
    title: string
    description: string
    category: string
  }
  relatedProjects: Project[]
}

export function AIChat({ projectDetails, relatedProjects }: AIChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user"

  return (
    <Card className="w-full h-[600px] flex flex-col bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
      <CardHeader className="flex-shrink-0">
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-grow overflow-y-auto mb-4 space-y-4 pr-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`max-w-[80%] p-2 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}
              >
                {m.content.split("\n").map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          ))}
          {isLoading && lastMessageIsUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="max-w-[80%] p-2 rounded-lg bg-gray-700 text-white"
              >
                <p>Thinking...</p>
              </motion.div>
            </motion.div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="flex-grow bg-[hsl(var(--input))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]"
          />
          <Button type="submit" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
