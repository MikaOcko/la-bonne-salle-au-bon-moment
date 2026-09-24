//----------- Imports -----------
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoom } from '../services/salle.service';
import './creerSalle.css';
import Button from '../components/button';


//----------- Logic -----------
// Validation schema
const creerSalleSchema = z.object({
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
    floor: z.number(),
    material: z.string().optional(),
});

type CreerSalleFormData = z.infer<typeof creerSalleSchema>;

//---------- Component render ----------
function CreerSalle() {
    // Navigation
    const navigate = useNavigate();
    // Message display (after click on the submit button)
    const [message, setMessage] = useState<string>("");
     const [errorMessage, setErrorMessage] = useState<string>("");
    // Zod
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreerSalleFormData>({
        resolver: zodResolver(creerSalleSchema),
    });

    async function onSubmit(data: CreerSalleFormData) {
        const material = data.material
            ? data.material.split(',').map((m) => m.trim())
            : [];

        try {
            await createRoom({ ...data, material });
            reset();

            setErrorMessage("");
            setMessage("Salle ajoutée");

            setTimeout(() => {
                navigate("/dashboardAdmin");
            }, 1000);
        } catch (error) {
             // Conserve l'erreur technique dans la console.
            console.error(error);

            // Message utilisateur en cas d'échec de l'appel API.
            setErrorMessage("La création de la salle a échoué.");
        }
        
    }

    return (
        <>
        
            <header>
                <div>
                    <Button description="retour" onClick={() => navigate('/DashboardAdmin')} />
                </div>
            </header>
            <main>
                <div className='container'>
                    <h2>Ajouter une nouvelle salle</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Nom de salle</label>
                            <input type="text" {...register("label")} placeholder='Salle informatique'/>
                            {errors.label && <p>{errors.label.message}</p>}
                        </div>

                        <div>
                            <label>Capacité d'accueil</label>
                            <input type="number" {...register("capacity", { valueAsNumber: true })} min={0}/>
                            {errors.capacity && <p>{errors.capacity.message}</p>}
                        </div>

                        <div>
                            <label>Matériel disponible</label>
                            <input type="text" {...register("material")} />
                        </div>

                        <div>
                            <label>Site</label>
                            <input type="text" {...register("site")} placeholder='Campus Ouest' />
                            {errors.site && <p>{errors.site.message}</p>}
                        </div>

                        <div>
                            <label>Bâtiment</label>
                            <input type="text" {...register("building")} placeholder='Bâtiment Charles Xavier' />
                            {errors.building && <p>{errors.building.message}</p>}
                        </div>

                        <div>
                            <label>Etage</label>
                            <input type="number" {...register("floor", { valueAsNumber: true })} min={0} placeholder='3'/>
                            {errors.floor && <p>{errors.floor.message}</p>}
                        </div>

                        <button type="submit">Valider</button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
            </main>
            
        </>
    );
}

export default CreerSalle;