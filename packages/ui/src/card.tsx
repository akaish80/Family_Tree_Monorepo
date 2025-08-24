import { type JSX } from "react";

export function Card({ className, title, children, href }: { className?: string; title: string; children: JSX.Element; href: string }): JSX.Element {
    return (
        <a href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=ui`} className={className} rel="noopener noreferrer" target="_blank">
            <h2>{title}</h2>
            <div>{children}</div>
        </a>
    );
}

