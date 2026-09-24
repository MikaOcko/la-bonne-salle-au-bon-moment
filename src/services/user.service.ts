// ============ Imports ===========

import type { UserType } from "../types/user.type";

const API_URL = import.meta.env.VITE_API_URL;
// ============ Logic ============
export async function createUser(user: object):Promise<UserType>  {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

    if (!response.ok) {
        throw new Error("Impossible de créer l'utilisateur");
    }
  return response.json();
}


