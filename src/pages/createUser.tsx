// ============ Imports ============
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "../services/user.service";
import { useNavigate } from 'react-router';
import Button from "../components/button";

// =========== Logic ============
// Schéma de validation
const utilisateurSchema = z.object({
  role: z.enum(["Admin", "Formateur"], {
    message: "Veuillez sélectionner un utilisateur",
  }),

  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),

  email: z
    .string()
    .email("L'adresse email n'est pas valide"),

  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Type généré automatiquement par Zod
type UserForm = z.infer<typeof utilisateurSchema>;

function CreateUserForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserForm>({
		resolver: zodResolver(utilisateurSchema),
	});

	// Fonction appelée lors de la validation du formulaire
	
	async function onSubmit(data: UserForm) {
		await createUser(data);
		reset();
	}

  return (
    <>
		<header>
            <div>
                <Button description="retour" onClick={() => navigate('/dashboardAdmin')} />
            </div>
        </header>
    
    <div className="bg-gray-400 p-6 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Type utilisateur */}
        <div className="mb-4">
          <label className="block mb-2">
            Type utilisateur
          </label>

          <select
            {...register("role")}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Sélectionnez un utilisateur</option>
            <option value="Admin">Admin</option>
            <option value="Formateur">Formateur</option>
          </select>

          {errors.role && (
            <p className="text-red-600">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Nom */}
        <div className="mb-4">
          <label className="block mb-2">
            Nom
          </label>

          <input
            type="text"
            placeholder="Nom"
            {...register("nom")}
            className="border border-gray-300 p-2 rounded"
          />

          {errors.nom && (
            <p className="text-red-600">
              {errors.nom.message}
            </p>
          )}
        </div>

        {/* Prénom */}
        <div className="mb-4">
          <label className="block mb-2">
            Prénom
          </label>

          <input
            type="text"
            placeholder="Prénom"
            {...register("prenom")}
            className="border border-gray-300 p-2 rounded"
          />

          {errors.prenom && (
            <p className="text-red-600">
              {errors.prenom.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="border border-gray-300 p-2 rounded"
          />

          {errors.email && (
            <p className="text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="mb-4">
          <label className="block mb-2">
            Mot de passe
          </label>

          <input
            type="password"
            placeholder="Mot de passe"
            {...register("password")}
            className="border border-gray-300 p-2 rounded"
          />

          {errors.password && (
            <p className="text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Valider
        </button>

      </form>
    </div>
	</>
  );
}

export default CreateUserForm;