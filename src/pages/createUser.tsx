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

  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

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
		<main>
			<div className='container'>
                <h2>Ajouter un nouvel utilisateur</h2>

				<form onSubmit={handleSubmit(onSubmit)}>

					{/* Type utilisateur */}
					<div>
						<label>
							Type utilisateur
						</label>

						<select {...register("role")}>
							<option value="">Sélectionnez un utilisateur</option>
							<option value="Admin">Admin</option>
							<option value="Formateur">Formateur</option>
						</select>

						{errors.role && (<p>{errors.role.message}</p>)}
					</div>

					{/* Nom */}
					<div>
						<label>
							Nom
						</label>

						<input type="text" placeholder="Nom Prénom" {...register("name")}/>

						{errors.name && (<p>{errors.name.message}</p>)}
					</div>

					{/* Email */}
					<div>
						<label>
							Email
						</label>

						<input type="email" placeholder="Email" {...register("email")}/>

						{errors.email && (<p>{errors.email.message}</p>)}
					</div>

					{/* Mot de passe */}
					<div >
						<label>
							Mot de passe
						</label>

						<input type="password" placeholder="Mot de passe" {...register("password")}/>

						{errors.password && (<p>{errors.password.message}</p>)}
					</div>

					{/* Bouton */}
					<button type="submit">Valider</button>
                    {/* <p>{message && <p>{message}</p>} */}

				</form>
			
			</div>
		</main>
      
	</>
  );
}

export default CreateUserForm;