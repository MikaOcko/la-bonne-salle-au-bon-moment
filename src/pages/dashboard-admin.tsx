// ---------- Imports --------
import './dashboard-admin.css';
import Button from '../components/button';
import Salle from '../components/salle';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { type RoomType } from '../types/room.type';

const API_URL = import.meta.env.VITE_API_URL;

//--------- Component ---------
function DashboardAdmin(){
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<RoomType[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/rooms`)
          .then((res) => res.json())
          .then((data) => setRooms(data))
          .catch((err) => console.error('Erreur lors du chargement des salles', err));
    }, []);
  
    return (
		<>  
			<header>
				<div>
					<Button description='se deconnecter' onClick={() => navigate('/')}/>
				</div>
			</header>
			<main>
				<div className='grid'>
					{rooms.map((room, index) => (
						<div key={room.id} className={`div${index + 1}`}>
							<Salle room={room}/>
						</div>
					))}
				</div>
			</main>
			<footer>
				<div>
					<Button description='ajouter une salle' onClick={() => navigate('/CreerSalle')}/>
					<Button description='créer un compte' onClick={() => navigate('/CreateUserForm')}/>
					<Button description='ajouter une reservation' onClick={() => navigate('/creerReservation')}/>
					<Button description='modifier une reservation' onClick={() => navigate('/modifierReservation')}/>
					<Button description='supprimer une reservation' onClick={() => navigate('/listeReservations')}/>
				</div>
			</footer>
		</>
    )

}

export default DashboardAdmin;

