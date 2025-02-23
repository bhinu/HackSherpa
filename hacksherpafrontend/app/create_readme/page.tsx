"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/navigation";

const formSchema = z.object({
  repoUrl: z.string().url("Please enter a valid URL"),
  additionalContext: z.string().optional(),
});

const templates = [
  {
    id: "standard",
    name: "Standard Template",
    description: "A comprehensive template suitable for most projects",
    content: `# Project Name

## Description
A brief description of what this project does and who it's for.

## Installation
\`\`\`bash
npm install my-project
\`\`\`

## Usage
\`\`\`javascript
import myProject from 'my-project'
// Usage example
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)
`,
  },
  {
    id: "minimal",
    name: "Minimal Template",
    description: "A clean, minimalist template for simple projects",
    content: `# Project Name
Brief project description

## Setup
Quick setup instructions

## Usage
Basic usage example

## License
MIT
`,
  },
];

export default function ReadmeGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("standard"); // mode
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [isReadmeCopied, setIsReadmeCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: "",
      additionalContext: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) {
      console.error("No template selected");
      return;
    }

    const mode = template.id == "standard" ? "default" : "minimal";

    const requestData = {
      repo_url: values.repoUrl,
      additional_context: values.additionalContext,
      mode,
    };

    const res = fetch("http://127.0.0.1:800/generate_readme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then((data) => {
        setGeneratedReadme(data.readme);
        setCurrentStep(4);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCopyReadme = async () => {
    if (!generatedReadme) return;
    await navigator.clipboard.writeText(generatedReadme);
    setIsReadmeCopied(true);
    setTimeout(() => setIsReadmeCopied(false), 2000);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const repoUrl = form.getValues("repoUrl");
      if (!repoUrl || !repoUrl.match(/^https?:\/\/.+/)) {
        form.setError("repoUrl", {
          type: "manual",
          message: "Please enter a valid URL",
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-4xl font-bold">README Generator</h1>

        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "border bg-background"
                )}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Repository</span>
            <span>Details</span>
            <span>Template</span>
            <span>Generate</span>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Enter Repository URL</h2>
                <FormField
                  control={form.control}
                  name="repoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username/repository"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Additional Details</h2>
                <FormField
                  control={form.control}
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional context about your project..."
                          className="h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Choose Template</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {templates.map((template) => (
                    <div key={template.id} className="space-y-4">
                      <div
                        className={cn(
                          "cursor-pointer rounded-lg border p-4 transition-all hover:shadow-lg",
                          selectedTemplate === template.id && "border-primary"
                        )}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                      <pre className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg border p-4 text-sm">
                        {template.content}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Generated README</h2>
                  {generatedReadme && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCopyReadme}
                    >
                      {isReadmeCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {generatedReadme ? (
                  <pre className="whitespace-pre-wrap rounded-lg border p-4 text-sm">
                    {generatedReadme}
                  </pre>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Click Generate to create your README
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {currentStep < 4 && (
                <Button type="button" className="ml-auto" onClick={nextStep}>
                  Next
                </Button>
              )}
              {currentStep === 4 && (
                <Button
                  type="button"
                  className="ml-auto"
                  onClick={() => handleSubmit(form.getValues())}
                >
                  Generate README
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
