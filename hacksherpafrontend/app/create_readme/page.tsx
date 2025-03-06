"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import Navigation from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"

// Zod schema for form validation
const formSchema = z.object({
  repoUrl: z.string().url("Please enter a valid URL"),
  additionalContext: z.string().optional(),
})

// Sample templates
const templates = [
  {
    id: "standard",
    name: "Standard Template",
    description: "A comprehensive template suitable for most projects",
    content: `# Project Name
...
## License
[MIT](https://choosealicense.com/licenses/mit/)
`,
  },
  {
    id: "minimal",
    name: "Minimal Template",
    description: "A clean, minimalist template for simple projects",
    content: `# Project Name
...
## License
MIT
`,
  },
]

export default function ReadmeGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState("standard") // "mode"
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null)
  const [isReadmeCopied, setIsReadmeCopied] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: "",
      additionalContext: "",
    },
  })

  // Handle final form submission on step 4
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const template = templates.find((t) => t.id === selectedTemplate)
    if (!template) {
      console.error("No template selected")
      return
    }

    // Map "standard" => "default", "minimal" => "minimal"
    const mode = template.id === "standard" ? "default" : "minimal"

    const requestData = {
      repo_url: values.repoUrl,
      additional_context: values.additionalContext,
      mode,
    }

    try {
      // Make sure NEXT_PUBLIC_API_URL points to your deployed domain
      // and that /pyapi/generate_readme is routed to Flask in vercel.json
      const res = await fetch(`/pyapi/generate_readme`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
      const data = await res.json()

      if (data.error) {
        console.error("Error from API:", data.error)
      } else {
        setGeneratedReadme(data.readme)
      }
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  // Copy generated README to clipboard
  const handleCopyReadme = async () => {
    if (!generatedReadme) return
    await navigator.clipboard.writeText(generatedReadme)
    setIsReadmeCopied(true)
    setTimeout(() => setIsReadmeCopied(false), 2000)
  }

  // Step navigation
  const nextStep = () => {
    // Validate repo URL on step 1
    if (currentStep === 1) {
      const repoUrl = form.getValues("repoUrl")
      if (!repoUrl || !repoUrl.match(/^https?:\/\/.+/)) {
        form.setError("repoUrl", {
          type: "manual",
          message: "Please enter a valid URL",
        })
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const steps = [
    { number: 1, label: "Repository" },
    { number: 2, label: "Details" },
    { number: 3, label: "Template" },
    { number: 4, label: "Generate" },
  ]

  return (
    <>
      <Navigation />
      <div className="relative min-h-screen bg-background dark:bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text text-center">
              README Generator
            </h1>

            <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                {/* Step progress bar */}
                <div className="relative mb-12">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2">
                    <div
                      className="absolute h-full bg-primary transition-all duration-300"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />
                  </div>
                  <div className="relative z-10 flex justify-between">
                    {steps.map((step) => (
                      <div key={step.number} className="flex flex-col items-center">
                        <motion.div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors duration-300",
                            currentStep >= step.number
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-background text-muted-foreground"
                          )}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: currentStep >= step.number ? 1 : 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {step.number}
                        </motion.div>
                        <span className="mt-2 text-sm text-muted-foreground">
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multi-step form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Step 1: Repository URL */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="repoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Repository URL (e.g., https://github.com/username/repo)"
                                  className="bg-background/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 2: Additional Context */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="additionalContext"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Additional context or specific requirements..."
                                  className="bg-background/50 min-h-[200px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 3: Template Selection */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid gap-4"
                      >
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className={cn(
                              "p-4 rounded-lg border cursor-pointer transition-colors duration-300",
                              selectedTemplate === template.id
                                ? "border-primary bg-primary/10"
                                : "border-border/50 bg-background/50 hover:bg-background/80"
                            )}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <h3 className="font-medium mb-2">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Step 4: Show the generated README if available */}
                    {currentStep === 4 && generatedReadme && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <pre className="p-4 rounded-lg bg-background/50 border border-border/50 overflow-x-auto">
                            <code className="text-sm">{generatedReadme}</code>
                          </pre>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleCopyReadme}
                          >
                            {isReadmeCopied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between pt-4">
                      {currentStep > 1 && (
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Previous
                        </Button>
                      )}
                      {currentStep < 4 ? (
                        <Button type="button" className="ml-auto" onClick={nextStep}>
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" className="ml-auto">
                          Generate README
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
