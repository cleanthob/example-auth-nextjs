import { getAuthCookie, verifyJwt } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const token = await getAuthCookie();
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Bem vindo(a), {payload.username}</h1>
      <p>ID do usuário: {payload.userId}</p>
    </div>
  );
}
