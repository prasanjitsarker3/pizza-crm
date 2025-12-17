"use server"

import { cookies } from "next/headers";
interface ILogin {
  email: string;
  password: string;
}

export const userLogin = async (data: ILogin) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Failed to login");
    }

    if (result?.statusCode === 200 && result?.data) {
      const token = result.data;
      (await cookies()).set("pizza-art-admin", token, {
        secure: true,
        sameSite: "none",
        maxAge: 60 * 24 * 60 * 30,
      });
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

}
