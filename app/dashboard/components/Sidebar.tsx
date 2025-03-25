"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      setRole(user.role);
    }
  }, []);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <ul className="mt-4 space-y-2">
        <li>
          <Link href="/dashboard">
            <span className="block p-2 hover:bg-gray-700 rounded">Home</span>
          </Link>
        </li>
        {role === "admin" && (
          <li>
            <Link href="/dashboard/admin">
              <span className="block p-2 hover:bg-gray-700 rounded">
                Admin Panel
              </span>
            </Link>
          </li>
        )}
        {role === "influencer" && (
          <li>
            <Link href="/dashboard/influencer">
              <span className="block p-2 hover:bg-gray-700 rounded">
                Influencer Dashboard
              </span>
            </Link>
          </li>
        )}
        {role === "brandOwner" && (
          <li>
            <Link href="/dashboard/brandOwner">
              <span className="block p-2 hover:bg-gray-700 rounded">
                Brand Owner Dashboard
              </span>
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
