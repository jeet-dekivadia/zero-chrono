import "./globals.css";

export const metadata = {
  title: "Zero Chrono",
  description: "HIPAA-safe clinical agent with graph + carbon HUD",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
