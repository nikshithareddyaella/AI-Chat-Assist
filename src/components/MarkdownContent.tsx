import { CodeBlock } from "@/components/CodeBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-4 text-xl font-semibold text-zinc-50 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-4 text-lg font-semibold text-zinc-50 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-3 text-base font-semibold text-zinc-100 first:mt-0">{children}</h3>
        ),
        pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
        code: ({ className, children, ...props }) => {
          const isBlock = Boolean(className);
          if (isBlock) {
            return (
              <code className={`font-mono text-[0.8125rem] ${className ?? ""}`} {...props}>
                {children}
              </code>
            );
          }
          return (
            <code
              className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.8125rem] text-violet-300"
              {...props}
            >
              {children}
            </code>
          );
        },
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-violet-400 underline-offset-2 hover:text-violet-300 hover:underline"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-3 border-l-2 border-violet-500/50 pl-4 text-zinc-400 italic">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => <ul className="my-2 list-disc space-y-1.5 pl-5 text-zinc-300">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal space-y-1.5 pl-5 text-zinc-300">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        p: ({ children }) => (
          <p className="my-2.5 leading-relaxed text-zinc-200 first:mt-0 last:mb-0">{children}</p>
        ),
        hr: () => <hr className="my-4 border-white/10" />,
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-white/10 bg-white/5 px-3 py-2 font-medium text-zinc-200">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-white/5 px-3 py-2 text-zinc-400">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
