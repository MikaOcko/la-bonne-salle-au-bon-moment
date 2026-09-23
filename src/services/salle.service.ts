// ----------- Imports -----------

/**
 * Type représentant la structure d'une salle dans l'application.
 *
 * Ce type est normalement défini dans :
 * ../types/room.type
 *
 * Il peut contenir, par exemple :
 * - _id : identifiant MongoDB / base de données
 * - label : nom de la salle
 * - capacity : capacité d'accueil
 * - site : campus ou site
 * - building : bâtiment
 * - floor : étage
 * - material : liste du matériel disponible
 */
import type { RoomType } from "../types/room.type";


// ----------- Configuration API -----------

/**
 * URL de base de l'API backend.
 *
 * La valeur est chargée depuis une variable d'environnement Vite :
 * VITE_API_URL
 *
 * Exemple dans un fichier .env :
 * VITE_API_URL=http://localhost:3000/something
 *
 * Toutes les requêtes de ce service utilisent cette URL comme base.
 */
const API_URL = import.meta.env.VITE_API_URL;


// ----------- Types optionnels -----------

/**
 * Type représentant les données nécessaires pour créer une salle.
 *
 * L'identifiant `_id` est retiré, car il est généré par la base de données
 * ou par le backend lors de la création.
 *
 */
// export type RoomPayload = Omit<RoomType, "_id">;


// ----------- Récupération des salles -----------

/**
 * Récupère toutes les salles enregistrées dans la base de données.
 *
 * Requête envoyée :
 * GET {API_URL}/rooms
 *
 * @returns Une promesse contenant un tableau de salles.
 * @throws Une erreur si le serveur répond avec un statut HTTP non valide.
 *
 * Exemple d'utilisation :
 * const rooms = await getSalles();
 */
export async function getSalles(): Promise<RoomType[]> {
    // Envoie une requête HTTP GET vers l'endpoint des salles.
    const response = await fetch(`${API_URL}/rooms`);

    /**
     * response.ok est true pour les réponses HTTP comprises entre 200 et 299.
     *
     * En cas d'erreur serveur, de route inexistante ou d'autorisation refusée,
     * une erreur est levée afin que le composant appelant puisse la gérer.
     */
    if (!response.ok) {
        throw new Error("Impossible de récupérer les salles");
    }

    /**
     * Convertit le corps JSON de la réponse en objet JavaScript.
     *
     * Le backend doit retourner un tableau compatible avec RoomType[].
     */
    return response.json();
}


// ----------- Récupération d'une salle -----------

/**
 * Récupère une salle à partir de son identifiant.
 *
 * Requête envoyée :
 * GET {API_URL}/rooms/:id
 *
 * @param id Identifiant unique de la salle à récupérer.
 * @returns Une promesse contenant les informations de la salle.
 * @throws Une erreur si la salle est introuvable ou si l'API répond en erreur.
 *
 * Exemple :
 * const room = await getRoomById("abc123");
 */
export async function getRoomById(id: string): Promise<RoomType> {
    // L'id est ajouté directement à l'URL de la requête.
    const response = await fetch(`${API_URL}/rooms/${id}`);

    // Vérifie que l'API a répondu avec un code HTTP de succès.
    if (!response.ok) {
        throw new Error("Impossible de récupérer la salle");
    }

    // Retourne les données JSON correspondant à la salle demandée.
    return response.json();
}


// ----------- Création d'une salle -----------

/**
 * Ancienne version recommandée de la fonction de création.
 *
 * Elle utilisait RoomPayload pour garantir que les données envoyées à l'API
 * correspondent bien aux champs d'une salle, sans inclure l'identifiant _id.
 *
 * Cette version est conservée ici à titre documentaire.
 */
// export async function createRoom(room: RoomPayload): Promise<RoomType> {
//     const response = await fetch(`${API_URL}/rooms`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(room),
//     });
//
//     if (!response.ok) {
//         throw new Error("Impossible de créer la salle.");
//     }
//
//     return response.json();
// }

/**
 * Crée une nouvelle salle dans la base de données.
 *
 * Requête envoyée :
 * POST {API_URL}/rooms
 *
 * @param room Objet contenant les informations de la salle à créer.
 * @returns Une promesse contenant la salle créée, généralement avec son _id.
 *
 * Important :
 * Le type `object` est très permissif. TypeScript ne vérifie pas que les
 * propriétés attendues par l'API sont présentes ou correctement typées.
 *
 * Il est préférable de remplacer `object` par `RoomPayload`.
 */
export async function createRoom(room: object): Promise<RoomType> {
    // Envoie une requête HTTP POST avec un corps JSON.
    const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",

        // Indique au backend que les données envoyées sont au format JSON.
        headers: {
            "Content-Type": "application/json",
        },

        // Transforme l'objet JavaScript en chaîne JSON avant l'envoi.
        body: JSON.stringify(room),
    });

    // Vérifie que l'API a répondu avec un code HTTP de succès.
    if (!response.ok) {
        throw new Error("Impossible de créer la salle");
    }

    // Retourne la réponse JSON envoyée par le backend.
    return response.json();
}


// ----------- Suppression d'une salle -----------

/**
 * Supprime une salle à partir de son identifiant.
 *
 * Requête envoyée :
 * DELETE {API_URL}/rooms/:id
 *
 * @param id Identifiant unique de la salle à supprimer.
 * @returns Une promesse résolue lorsque la suppression est réussie.
 * @throws Une erreur si la suppression échoue.
 *
 * Le backend peut répondre sans corps JSON, notamment avec le statut HTTP 204.
 * C'est pourquoi cette fonction ne retourne pas response.json().
 */
export async function deleteRoom(id: string): Promise<void> {
    // Envoie une requête HTTP DELETE vers la salle concernée.
    const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "DELETE",
    });

    // Déclenche une erreur si le backend n'a pas validé la suppression.
    if (!response.ok) {
        throw new Error("Impossible de supprimer la salle.");
    }
}


// ----------- Modification d'une salle -----------

/**
 * Met à jour partiellement les informations d'une salle existante.
 *
 * Requête envoyée :
 * PATCH {API_URL}/rooms/:id
 *
 * PATCH est utilisé plutôt que PUT, car seuls les champs fournis dans `room`
 * ont vocation à être modifiés.
 *
 * @param id Identifiant unique de la salle à modifier.
 * @param room Objet contenant uniquement les champs à mettre à jour.
 * @returns Une promesse contenant la salle mise à jour.
 * @throws Une erreur si la modification échoue.
 *
 * Exemple :
 * await updateRoom("abc123", {
 *     label: "Salle informatique 2",
 *     capacity: 30,
 * });
 */
export async function updateRoom(
    id: string,
    room: Partial<object>
): Promise<RoomType> {
    // Envoie une requête PATCH avec les nouveaux champs de la salle.
    const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "PATCH",

        // Indique que les données sont transmises sous forme de JSON.
        headers: {
            "Content-Type": "application/json",
        },

        // Sérialise les modifications avant l'envoi au backend.
        body: JSON.stringify(room),
    });

    // Vérifie que le serveur a accepté et appliqué les modifications.
    if (!response.ok) {
        throw new Error("Impossible de modifier la salle.");
    }

    // Retourne la salle mise à jour reçue depuis l'API.
    return response.json();
}