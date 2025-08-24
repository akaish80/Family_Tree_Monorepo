"use client";

import { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode;
    className?: string;
    appName?: string;
}

export function Button({ children, className, appName }: ButtonProps) {
    return <button className={className} data-app-name={appName}>{children}</button>;
}
