import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTF 2024 Sandbox",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
