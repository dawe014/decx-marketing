import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <body>
      {/* Here you can add common elements like a header, sidebar, or footer for the dashboard */}
      <main className="-mt-20">{children}</main>
    </body>
  );
}
