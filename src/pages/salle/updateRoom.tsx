//----------- Imports -----------

// Hooks React :
// - useEffect permet d'exécuter du code lors du montage du composant.
// - useState permet de stocker des valeurs qui évoluent dans le composant.
import { useEffect, useState } from 'react';

// Bibliothèque de gestion de formulaires React.
import { useForm } from 'react-hook-form';

// Hooks React Router :
// - useNavigate permet de rediriger l'utilisateur vers une autre page.
// - useParams permet de récupérer les paramètres présents dans l'URL (ici l'id de la salle).
import { useNavigate, useParams } from 'react-router';

// Zod sert à définir et appliquer un schéma de validation des données.
import { z } from 'zod';

// Connecte le schéma Zod à react-hook-form.
import { zodResolver } from '@hookform/resolvers/zod';

// Services permettant de communiquer avec l'API des salles :
// - getRoomById récupère les informations d'une salle.
// - updateRoom envoie les modifications d'une salle.
import { getRoomById, updateRoom } from '../../services/salle.service';

// Feuille de style dédiée à cette page.
import './updateRoom.css';

// Composant bouton réutilisable de l'application.
import Button from '../../components/button';


//----------- Logique de validation -----------

/**
 * Schéma Zod de validation du formulaire de modification.
 *
 * Les champs doivent respecter les contraintes suivantes :
 * - label : nom de la salle, au moins 3 caractères.
 * - capacity : nombre positif strictement supérieur à 0.
 * - site : nom du site, au moins 3 caractères.
 * - building : nom du bâtiment, au moins 1 caractère.
 * - floor : nombre représentant l'étage.
 * - material : texte facultatif contenant la liste du matériel.
 */
const updateRoomSchema = z.object({
    label: z
        .string()
        .min(3, "Le nom de la salle doit avoir au minimum 3 caractères."),

    capacity: z
        .number()
        .positive("La capacité doit être supérieure à 0."),

    site: z
        .string()
        .min(3, "Le site doit avoir au minimum 3 caractères."),

    building: z
        .string()
        .min(1, "Le bâtiment doit avoir au minimum 1 caractère."),

    floor: z
        .number()
        .min(0, "L'étage ne peut pas être négatif."),

    // Le matériel est facultatif dans le formulaire.
    // Il est saisi sous forme de texte, par exemple :
    // "Vidéoprojecteur, Tableau, Ordinateurs"
    material: z.string().optional(),
});

/**
 * Type TypeScript généré automatiquement à partir du schéma Zod.
 *
 * Cela évite de maintenir séparément :
 * - le type TypeScript ;
 * - les règles de validation.
 */
type UpdateRoomFormData = z.infer<typeof updateRoomSchema>;


//---------- Composant ----------

/**
 * Page de modification d'une salle.
 *
 * Fonctionnement :
 * 1. Récupère l'identifiant de la salle depuis l'URL.
 * 2. Charge les informations actuelles de la salle depuis l'API.
 * 3. Pré-remplit le formulaire avec ces informations.
 * 4. Valide les données saisies.
 * 5. Envoie les modifications à l'API.
 * 6. Redirige l'utilisateur vers le tableau de bord administrateur.
 */
function UpdateRoom() {
    // Permet de naviguer vers une autre route de l'application.
    const navigate = useNavigate();

    // Récupère l'identifiant présent dans l'URL.
    // Exemple de route possible : /updateRoom/42
    const { id } = useParams<{ id: string }>();

    // Message affiché après une modification réussie.
    const [message, setMessage] = useState<string>("");

    // Message d'erreur lié au chargement ou à l'enregistrement.
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Indique si les données initiales de la salle sont encore en cours de chargement.
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Configuration de react-hook-form.
     *
     * - register : relie les champs HTML au formulaire.
     * - handleSubmit : valide le formulaire avant d'appeler onSubmit.
     * - errors : contient les erreurs de validation retournées par Zod.
     * - reset : remplit ou réinitialise les champs du formulaire.
     */
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateRoomFormData>({
        // Utilise le schéma Zod défini plus haut pour valider le formulaire.
        resolver: zodResolver(updateRoomSchema),
    });

    /**
     * Chargement des informations de la salle au montage du composant,
     * ou lorsque l'identifiant de la salle change.
     */
    useEffect(() => {
        async function loadRoom() {
            // Vérifie que l'URL contient bien un identifiant de salle.
            if (!id) {
                setErrorMessage("Identifiant de salle introuvable.");
                setIsLoading(false);
                return;
            }

            try {
                // Appel API pour récupérer la salle associée à l'id.
                const room = await getRoomById(id);

                /**
                 * Pré-remplit le formulaire avec les données reçues.
                 *
                 * room.material est supposé être un tableau, par exemple :
                 * ["Vidéoprojecteur", "Tableau", "Ordinateurs"]
                 *
                 * Comme le champ formulaire est un input texte, le tableau est
                 * converti en une chaîne séparée par des virgules :
                 * "Vidéoprojecteur, Tableau, Ordinateurs"
                 */
                reset({
                    label: room.label,
                    capacity: room.capacity,
                    site: room.site,
                    building: room.building,
                    floor: room.floor,
                    material: room.material.join(", "),
                });
            } catch (error) {
                // Journalise l'erreur technique dans la console pour le débogage.
                console.error(error);

                // Stocke un message compréhensible pour l'utilisateur.
                setErrorMessage("Impossible de charger les informations de la salle.");
            } finally {
                // Le chargement est terminé, qu'il ait réussi ou échoué.
                setIsLoading(false);
            }
        }

        loadRoom();
    }, [id, reset]);
    // Dépendances :
    // - id : si l'id dans l'URL change, les données doivent être rechargées.
    // - reset : fonction utilisée pour remplir le formulaire.

    /**
     * Fonction exécutée lorsque le formulaire est valide et soumis.
     *
     * @param data Données validées par react-hook-form et Zod.
     */
    async function onSubmit(data: UpdateRoomFormData) {
        // Vérification supplémentaire au cas où l'id serait absent.
        if (!id) {
            setErrorMessage("Identifiant de salle introuvable.");
            return;
        }

        /**
         * Conversion du matériel saisi en texte vers un tableau.
         *
         * Exemple :
         * "Vidéoprojecteur, Tableau, Ordinateurs"
         *
         * devient :
         * ["Vidéoprojecteur", "Tableau", "Ordinateurs"]
         *
         * Étapes :
         * - split(",") : découpe la chaîne à chaque virgule ;
         * - trim() : retire les espaces inutiles ;
         * - filter() : supprime les valeurs vides.
         */
        const material = data.material
            ? data.material
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
            : [];

        try {
            // Réinitialise les éventuels messages affichés précédemment.
            setErrorMessage("");
            setMessage("");

            /**
             * Envoie les nouvelles données à l'API.
             *
             * L'id identifie la salle à modifier.
             * Le second argument contient les champs mis à jour.
             */
            await updateRoom(id, {
                label: data.label,
                capacity: data.capacity,
                site: data.site,
                building: data.building,
                floor: data.floor,
                material,
            });

            // Informe l'utilisateur que la modification a réussi.
            setMessage("Salle modifiée avec succès.");

            /**
             * Redirection vers le tableau de bord après une seconde.
             *
             * Ce délai laisse le temps à l'utilisateur de lire le message
             * de confirmation.
             */
            setTimeout(() => {
                navigate("/dashboardAdmin");
            }, 1000);
        } catch (error) {
            // Conserve l'erreur technique dans la console.
            console.error(error);

            // Message utilisateur en cas d'échec de l'appel API.
            setErrorMessage("La modification de la salle a échoué.");
        }
    }

    /**
     * Tant que les données de la salle ne sont pas récupérées,
     * le formulaire n'est pas affiché.
     */
    if (isLoading) {
        return <p>Chargement de la salle…</p>;
    }

    //---------- Rendu de l'interface ----------
    return (
        <>
            <header>
                <div>
                    {/*
                      Bouton permettant de revenir au tableau de bord administrateur.
                    */}
                    <Button
                        description="retour"
                        onClick={() => navigate('/dashboardAdmin')}
                    />
                </div>
            </header>

            <main>
                <div className='container'>
                    <h2>Modifier une salle</h2>

                    {/*
                      handleSubmit exécute d'abord la validation Zod.
                      Si les données sont valides, onSubmit est appelé.
                      Sinon, les erreurs sont disponibles dans errors.
                    */}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <label htmlFor="label">Nom de salle</label>

                            {/*
                              register("label") relie cet input à la propriété
                              "label" des données du formulaire.
                            */}
                            <input
                                id='label'
                                type="text"
                                {...register("label")}
                                placeholder='Salle informatique'
                            />

                            {/* Affiche le message d'erreur de validation du nom. */}
                            {errors.label && <p>{errors.label.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="capacity">Capacité d'accueil</label>

                            {/*
                              valueAsNumber convertit la valeur saisie, qui est reçue
                              sous forme de texte par HTML, en nombre JavaScript.
                            */}
                            <input
                                id='capacity'
                                type="number"
                                {...register("capacity", { valueAsNumber: true })}
                                min={1}
                            />

                            {/* Affiche l'erreur liée à la capacité. */}
                            {errors.capacity && <p>{errors.capacity.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="material">Matériel disponible</label>

                            {/*
                              Le matériel est saisi sous forme de texte séparé
                              par des virgules.
                              Exemple : "Vidéoprojecteur, Tableau, Ordinateurs"
                            */}
                            <input
                                id='material'
                                type="text"
                                {...register("material")}
                            />
                        </div>

                        <div>
                            <label htmlFor="site">Site</label>
                            <input
                                id='site'
                                type="text"
                                {...register("site")}
                                placeholder='Campus Ouest'
                            />

                            {/* Affiche l'erreur liée au site. */}
                            {errors.site && <p>{errors.site.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="building">Bâtiment</label>
                            <input
                                id='building'
                                type="text"
                                {...register("building")}
                                placeholder='Bâtiment Charles Xavier'
                            />

                            {/* Affiche l'erreur liée au bâtiment. */}
                            {errors.building && <p>{errors.building.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="floor">Etage</label>

                            {/*
                              floor est également converti en nombre grâce à
                              valueAsNumber.
                            */}
                            <input
                                id='floor'
                                type="number"
                                {...register("floor", { valueAsNumber: true })}
                                min={0}
                                placeholder='3'
                            />

                            {/* Affiche l'erreur liée à l'étage. */}
                            {errors.floor && <p>{errors.floor.message}</p>}
                        </div>

                        {/* Déclenche la validation puis la mise à jour de la salle. */}
                        <button type="submit">Valider</button>

                        {/* Affiche le message de succès après mise à jour. */}
                        {message && <p>{message}</p>}

                        {/*
                          Affiche une erreur API ou une erreur d'identifiant.
                          Cette ligne est recommandée, car errorMessage est défini
                          dans la logique mais n'était pas affiché dans le code initial.
                        */}
                        {errorMessage && <p>{errorMessage}</p>}
                    </form>
                </div>
            </main>
        </>
    );
}

// Rend le composant disponible à l'import dans les fichiers de routes.
export default UpdateRoom;