// app/dashboard/layout.tsx or a shared RootLayout file
import { SessionProvider } from "next-auth/react";
import React from "react";
import "../globals.css"; // Import global styles
import { ToastProvider } from "@/components/Toaster";

export const metadata = {
  title: "Dashboard | DECx Marketing Agency",
  description: "Admin and Brand Owner Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You can add global meta tags, fonts, or stylesheets here */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className="">
        {/* Optional: Layout wrapper that includes Header/Sidebar */}
        <div className="flex min-h-screen">
          {/* Sidebar can include navigation links based on user role */}

          <main className="flex-1">
            <SessionProvider>
              {/* Page Content */}
              {children}
            </SessionProvider>
            <ToastProvider />
          </main>
        </div>
      </body>
    </html>
  );
}
