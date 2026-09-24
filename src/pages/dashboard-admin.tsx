// ---------- Imports --------
import './dashboard-admin.css';
import Button from '../components/button';
import Salle from '../components/salle';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { type RoomType } from '../types/room.type';
import { deleteRoom } from '../services/salle.service';
import type { UserType } from '../types/user.type';

const API_URL = import.meta.env.VITE_API_URL;

//--------- Component ---------
function DashboardAdmin(){
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);

	// getSalles() ?
    useEffect(() => {
        fetch(`${API_URL}/rooms`)
          .then((res) => res.json())
          .then((data) => setRooms(data))
          .catch((err) => console.error('Erreur lors du chargement des salles', err));
    }, []);

	useEffect(() => {
        fetch(`${API_URL}/users`)
          .then((res) => res.json())
          .then((data) => setUsers(data))
          .catch((err) => console.error('Erreur lors du chargement des utilisateurs', err));
    }, []);
	
	const handleDeleteRoom = async (id: string) => {
		try {
			await deleteRoom(id);
			// Mettre à jour l’état local : retirer la salle supprimée
			setRooms((prev) => prev.filter((room) => room._id !== id));
		} catch (err) {
			console.error('Erreur lors de la suppression de la salle', err);
		}
	};
  
    return (
		<>  
			<header>
				<div>
					<Button description='se deconnecter' onClick={() => navigate('/')}/>
				</div>
			</header>
			<main>
				{/* Les salles */}
				<section>
					<h2>Les salles</h2>
					<div className='grid'>
						{rooms.map((room) => (
							<div key={room._id}>
								<Salle room={room}/>
								<Button description='Supprimer' onClick={() => handleDeleteRoom(room._id)}/>
								<Button description='Modifier' onClick={() => navigate(`/updateRoom/${room._id}`)}/>
							</div>
						))}
					</div>
				</section>
				{/* Les utilisateurs */}
				<section>
					<h2>Les utilisateurs</h2>
					<div className='grid'>
						{users.map((user) => (
							<div key={user._id}>
								<p>{user.name}</p>
								<p>{user.email}</p>
								{/* <Button description='Supprimer' onClick={() => handleDeleteUser(user._id)}/>
								<Button description='Modifier' onClick={() => navigate(`/updateUser/${user._id}`)}/> */}
							</div>
						))}
					</div>
				</section>
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

