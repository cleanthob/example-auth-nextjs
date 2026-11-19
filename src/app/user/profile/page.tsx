"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState<{
    userId: string;
    username: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/auth/user");

      if (response.ok) {
        const data = await response.json();

        setUser(data);
      } else {
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  return user ? (
    <div>
      <h2>Informações do usuário</h2>
      <p>Username: {user.username}</p>
      <p>User ID: {user.userId}</p>

      <button
        className="cursor-pointer bg-blue-500 text-white  rounded-2xl  p-3"
        onClick={async () => {
          const response = await fetch("/api/auth/logout");

          if (response.ok) {
            setUser(null);
            router.replace("/login");
            router.refresh();
          }
        }}
      >
        Sair do conta
      </button>
    </div>
  ) : (
    <p>Carregando...</p>
  );
}
