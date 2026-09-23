//Imports
import { Routes, Route } from "react-router";
import Connexion from "./pages/connexion";
import DashboardAdmin from "./pages/dashboard-admin";
import DashboardFormateur from "./pages/dashboard-formateur";
import CreateUserForm from "./pages/createUser";
import CreerSalle from "./pages/creerSalle";
import Agenda from "./pages/agenda";
import CreerReservation from "./pages/creerReservation";
import ModifierReservation from "./pages/modifierReservation"; // AJOUT
import ListeReservations from "./pages/listeReservations";


//Composant
function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Connexion/>} />
			<Route path="/dashboardAdmin" element={<DashboardAdmin/>} />
			<Route path="/dashboardFormateur" element={<DashboardFormateur/>} />
			<Route path="/createUserForm" element={<CreateUserForm/>} />
			<Route path="/creerSalle" element={<CreerSalle/>} />
			<Route path="/agenda" element={<Agenda/>}/>
			<Route path="/creerReservation" element={<CreerReservation/>} />
			<Route path="/modifierReservation" element={<ModifierReservation/>} /> 
			<Route path="/listeReservations" element={<ListeReservations/>} />
		</Routes>
	);
}

export default AppRoutes;