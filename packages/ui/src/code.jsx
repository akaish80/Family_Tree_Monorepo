import { type JSX } from "react"

export function Code({ children, className }: { children: JSX.Element; className?: string }): JSX.Element {
    return <pre className={className}><code>{children}</code></pre>;
}
