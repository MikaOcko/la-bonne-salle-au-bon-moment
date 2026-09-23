// ----------- Imports ----------
import { type RoomType } from '../types/room.type';

// ----------- logic ----------
function Salle({ room }: { room: RoomType }) {
	return (
		<div>
			<p>Salle : {room.label}</p>
			<p>capacité : {room.capacity}</p>
			<p>Site : {room.site}</p>
			<p>Bâtiment : {room.building}</p>
			<p>Etage : {room.floor}</p>
			{/* <p>Matériels : {room.material}</p> */}
		</div>
	);
}

export default Salle;