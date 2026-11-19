import { User } from "@/types/user";
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const mockUsers: User[] = [
  {
    userId: "1",
    username: "admin",
    password: "123456",
  },
];

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = mockUsers.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json(
      {
        error: "User does not exist",
      },
      { status: 401 },
    );
  }

  const myHashedPassword = await bcrypt.hash(user.password, 10);

  const isPasswordValid = await compare(password, myHashedPassword);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Incorret password" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    },
  );

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.JWT_EXPIRES_IN),
    path: "/",
  });

  return response;
}
