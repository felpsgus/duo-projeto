import { Button } from '@mui/material'
import localforage from 'localforage'

const Logout: React.FC = () => {
	const handleLogout = () => {
		localforage.removeItem('userLogged')
		window.location.href = '/login'
	}

	return (
		<Button type="button" variant="outlined" onClick={handleLogout}>
			Logout
		</Button>
	)
}

export default Logout
