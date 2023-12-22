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
	id?: number
	user: string
	name: string
	email: string
	phone: string
	password: string
}

const Registrar: React.FC = () => {
	const [formData, setFormData] = React.useState<FormData>({
		user: '',
		name: '',
		email: '',
		phone: '',
		password: ''
	})

	const TYPES: { [key: string]: string } = {
		phone: '(99) 99999-9999'
	}

	function applyMask(value: string, name: string) {
		if (TYPES[name] === undefined) return value
		value = (value as string).replace(/[^0-9]/g, '')
		const mask = TYPES[name]
		let result = ''

		let inc = 0
		Array.from(value).forEach((letter, index) => {
			while (
				mask[index + inc] !== undefined &&
				mask[index + inc].match(/[0-9]/) === null
			) {
				result += mask[index + inc]
				inc++
			}
			result += letter
		})
		return result
	}

	const [errors, setErrors] = React.useState<string[]>([])

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		length: number | null = null
	): void => {
		if (length !== null && event.target.value.length > length) return

		event.target.value = applyMask(event.target.value, event.target.name)

		const { name, value } = event.target
		setFormData({
			...formData,
			[name]: value
		})
	}

	const handleSubmit = async (event: React.FormEvent): Promise<void> => {
		event.preventDefault()

		if (!validateInputs()) {
			return
		}

		const users = (await localforage.getItem<FormData[]>('users')) || []
		formData.id = (users[users.length - 1]?.id ?? 0) + 1;
		users?.push(formData)

		await localforage.setItem('users', users)
		await localforage.setItem('userLogged', formData)

		window.location.href = '/'
	}

	const validateInputs = (): boolean => {
		const { user, name, email, phone, password } = formData
		var errors = []

		if (user === '') {
			errors.push('Usuário não pode ser vazio!')
		}
		if (name === '') {
			errors.push('Nome não pode ser vazio!')
		}
		if (email === '') {
			errors.push('E-mail não pode ser vazio!')
		}
		if (phone === '') {
			errors.push('Telefone não pode ser vazio!')
		}
		if (password === '') {
			errors.push('Senha não pode ser vazio!')
		}

		if (errors.length > 0) {
			setErrors(errors)
			return false
		} else {
			return true
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
					Registrar
				</Typography>
				{errors.map(error => (
					<Alert severity="error" sx={{ mb: 2 }}>
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
								name="user"
								required
								fullWidth
								id="user"
								label="Usuário"
								onChange={handleChange}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="name"
								required
								fullWidth
								id="name"
								label="Nome"
								onChange={handleChange}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="email"
								required
								fullWidth
								id="email"
								label="E-mail"
								onChange={handleChange}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="phone"
								required
								fullWidth
								id="phone"
								label="Telefone"
								onChange={handleChange}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Senha"
								onChange={handleChange}
								type="password"
								id="password"
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Registrar
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/login" variant="body2">
								Já tem uma conta? Faça login!
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	)
}

export default Registrar
