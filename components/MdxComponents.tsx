"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

const Mermaid = dynamic(() => import("./Mermaid"), { ssr: false });

import { Diagram } from "./DiagramEmbed";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={copy}
      className="copy-btn absolute right-2 top-2 rounded-md border px-2 py-1 text-xs font-medium opacity-0 transition-all group-hover:opacity-100"
      style={{
        borderColor: "var(--border-color)",
        color: copied ? "var(--accent-hex)" : "var(--text-secondary)",
        backgroundColor: "var(--bg)",
      }}
      aria-label="Copy code"
    >
      {copied ? (
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </span>
      )}
    </button>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText(node.props.children);
  }
  return "";
}

export function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  // Check if the child is a <code> with mermaid language class
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    typeof children.props?.className === "string" &&
    children.props.className.includes("language-mermaid")
  ) {
    const chart = typeof children.props.children === "string"
      ? children.props.children.trim()
      : "";
    return <Mermaid chart={chart} />;
  }

  const codeText = extractText(children).trim();

  return (
    <div className="group relative">
      <CopyButton text={codeText} />
      <pre {...props}>{children}</pre>
    </div>
  );
}

export { Diagram };
