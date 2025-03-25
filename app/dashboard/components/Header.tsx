"use client";
import { useEffect, useState } from "react";

const Header = () => {
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
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-lg font-bold">
        Welcome, {role ? role.toUpperCase() : "User"}!
      </h1>
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        onClick={() => {
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
