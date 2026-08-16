import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/theme-provider"
import Container from "@/components/global/Container";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider  } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "E store",
  description: "E store build with next js",
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ClerkProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
                    <Navbar />

          <Container className="p-24">
            {children}

          </Container>
          <Toaster />

        </ThemeProvider>
        </ClerkProvider>


      </body>
    </html>
  );
}
