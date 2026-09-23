// src/services/salle.service.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function createSalle(salle: object) {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salle),
  });

  return response.json();
}

export async function getSalles() {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les salles");
  }

  return response.json();
}
