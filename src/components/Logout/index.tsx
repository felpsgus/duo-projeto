import { Button } from '@mui/material'

const Logout: React.FC = () => {

	const handleLogout = () => {
		localStorage.removeItem('token')
		window.location.href = '/login'
	}
	
	return (
		<Button
			type="button"
			variant="outlined"
			onClick={handleLogout}
		>
			Logout
		</Button>
	)
}

export default Logout
