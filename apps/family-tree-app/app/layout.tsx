import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalHeader from "./components/GlobalHeader";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "Family Tree App",
    description: "A visual family tree builder and editor",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <GlobalHeader />
                {children}
            </body>
        </html>
    );
}
