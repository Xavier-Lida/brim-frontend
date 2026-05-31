"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type AssistantMarkdownProps = {
  content: string;
  className?: string;
};

export function AssistantMarkdown({ content, className }: AssistantMarkdownProps) {
  return (
    <div className={cn("text-sm", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-medium text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="text-foreground/90">{children}</em>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-0.5">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
