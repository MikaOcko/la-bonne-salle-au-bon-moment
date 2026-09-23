// ----------- Imports -----------

const API_URL = import.meta.env.VITE_API_URL;

// ----------- Logic -----------

export async function createSalle(room: object) {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
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
