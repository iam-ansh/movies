import "./globals.css";
import { AuthProvider } from "../provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
