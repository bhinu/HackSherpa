"use client"

import { useEffect } from "react"
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
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  useEffect(() => {
    if (relatedProjects.length > 0 && messages.length === 0) {
      // Dummy AI response
      const dummyResponse = `Based on your interests, I suggest the following project ideas you should start working on:

1. Smart Home Energy Optimizer: Develop an IoT system that optimizes energy consumption in homes by analyzing usage patterns and integrating with smart devices.

2. AI-Powered Language Learning Assistant: Create a mobile app that uses AI to provide personalized language learning experiences, including real-time pronunciation feedback and adaptive lesson plans.

3. Blockchain-based Volunteer Hour Tracking: Build a web platform that uses blockchain technology to securely track and verify volunteer hours for students and organizations.

4. Augmented Reality Plant Identification and Care Guide: Design a mobile app that uses AR to identify plants and provide care instructions, integrating with local climate data for personalized recommendations.

These ideas are inspired by the related projects you've explored:

1. Project A (Web Development): This project's focus on web technologies could be applied to the blockchain-based volunteer tracking system, ensuring a user-friendly interface for tracking hours.

2. Project B (Mobile App): The mobile expertise from this project aligns well with the AR plant identification app or the AI language learning assistant, leveraging smartphone capabilities for innovative solutions.

3. Project C (Artificial Intelligence): The AI components in this project could be adapted for the language learning assistant or to enhance the plant care recommendations in the AR app.

4. Project D (Internet of Things): The IoT experience from this project is directly applicable to the Smart Home Energy Optimizer, allowing for seamless integration of various smart devices.

Each of these project ideas combines elements from your interests and the related projects, while also addressing real-world challenges. They offer opportunities to showcase your skills in ${projectDetails.category} and explore new technologies. Remember to consider factors like project scope, technical feasibility, and potential impact when choosing your hackathon project. Good luck!`

      // Simulate AI response
      setTimeout(() => {
        handleSubmit(new Event("submit") as any, {
          options: {
            body: JSON.stringify({
              messages: [{ role: "assistant", content: dummyResponse }],
            }),
          },
        })
      }, 1000)
    }
  }, [relatedProjects, projectDetails, messages.length, handleSubmit])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
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
                className={`max-w-[80%] p-2 rounded-lg ${m.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
              >
                {m.content.split("\n").map((line, index) => (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Is there anything you want to ask about?"
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}
