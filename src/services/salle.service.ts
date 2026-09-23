// ----------- Imports -----------
// API URL (from DB)
const API_URL = import.meta.env.VITE_API_URL;

// ----------- Logic -----------
// Function to retrieve all rooms (into DB)
export async function getSalles() {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les salles");
  }

  return response.json();
}

// Funtion to create a new room
export async function createRoom(room: object) {
	const response = await fetch(`${API_URL}/rooms`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(room),
	});

	return response.json();
}

// Function to delete one room
export async function deleteRoom(id:string){
	// if (!id) {
    // 	throw new Error("Impossible de supprimer la salle : identifiant manquant.");
 	//  };

	const response = await fetch(`${API_URL}/rooms/${id}`, {
		method: "DELETE",
	});
	console.log(id);
	console.log(response);
	if (!response.ok) {
    	throw new Error("Impossible de supprimer la salle.");
  	}

	return response;
};

