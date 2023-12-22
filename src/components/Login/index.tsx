import * as React from 'react'
import {
	Button,
	Box,
	Container,
	Grid,
	TextField,
	Typography,
	Link,
	Alert,
	AlertTitle
} from '@mui/material'
import localforage from 'localforage'

interface FormData {
	user: string
	password: string
}

const Login: React.FC = () => {
	const [formData, setFormData] = React.useState<FormData>({
		user: '',
		password: ''
	})

	const [errors, setErrors] = React.useState<string[]>([])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setFormData({
			...formData,
			[name]: value
		})
	}

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault()

		const users = (await localforage.getItem<FormData[]>('users')) || []

		const { user, password } = formData
		const userExists = users.find(
			u => u.user === user && u.password === password
		)

		if (userExists) {
			localforage.setItem('userLogged', userExists)
			window.location.href = '/'
		} else {
			setErrors(['Usuário ou senha incorretos'])
		}
	}

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<Typography component="h1" variant="h3" sx={{ mb: 2 }}>
					Login
				</Typography>
				{errors.map((error, index) => (
					<Alert severity="error" sx={{ mb: 2 }} key={index}>
						<AlertTitle>{error}</AlertTitle>
					</Alert>
				))}
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit}
					sx={{ mt: 3 }}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								autoComplete="given-name"
								name="user"
								required
								fullWidth
								id="user"
								label="Usuário"
								autoFocus
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Senha"
								type="password"
								id="password"
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Login
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/registrar" variant="body2">
								Não possui uma conta? Faça seu cadastro!
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	)
}

export default Login
