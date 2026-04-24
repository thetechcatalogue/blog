"use client";

import dynamic from "next/dynamic";

const Mermaid = dynamic(() => import("./Mermaid"), { ssr: false });

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

  return <pre {...props}>{children}</pre>;
}
