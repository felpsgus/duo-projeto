import {
	Box,
	Button,
	CircularProgress,
	Grid,
	Fade,
	Modal,
	TextField,
	Typography,
	Alert,
	AlertTitle,
	styled
} from '@mui/material'
import * as React from 'react'
import localforage from 'localforage'
import { useState } from 'react'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	bgcolor: 'background.paper',
	boxShadow: 24,
	borderRadius: 2,
	p: 4,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center'
}

interface Data {
	id?: number
	user: string
	name: string
	email: string
	phone: string
	password: string
}

interface ModalCadastrarProps {
	onClose?: () => void
	button?: string
}

const StyledFade = styled(Fade)({
	display: 'flex'
})

const ModalCadastrar: React.FC<ModalCadastrarProps> = props => {
	const { onClose } = props

	const TYPES: { [key: string]: string } = {
		phone: '(99) 99999-9999'
	}

	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [errors, setErrors] = useState<string[]>([])
	const [success, setSuccess] = useState(false)
	const [formData, setFormData] = useState<Data>({
		id: 0,
		user: '',
		name: '',
		email: '',
		phone: '',
		password: ''
	})

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

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

	const validateData = (): boolean => {
		let errorsAux: string[] = []

		if (formData.user === '')
			errorsAux.push('O campo usuário é obrigatório')

		if (formData.password === '')
			errorsAux.push('O campo senha é obrigatório')
		else if (formData.password.length < 6)
			errorsAux.push('O campo senha deve ter no mínimo 6 caracteres')

		if (formData.name === '') errorsAux.push('O campo nome é obrigatório')

		const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (formData.email === '')
			errorsAux.push('O campo e-mail é obrigatório')
		else if (!regexEmail.test(formData.email))
			errorsAux.push('O campo e-mail é inválido')

		if (formData.phone === '')
			errorsAux.push('O campo telefone é obrigatório')
		else if (formData.phone.length !== 15)
			errorsAux.push('O campo telefone deve ter 15 caracteres')

		setErrors(errorsAux)
		return errorsAux.length === 0
	}

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault()

		setLoading(true)

		let valid = validateData()
		if (!valid) {
			setLoading(false)
			return
		}

		var isLogged = await localforage.getItem('userLogged')
		if (!isLogged) {
			window.location.href = '/login'
			return
		}

		const users = (await localforage.getItem<Data[]>('users')) || []

		if (users?.find(user => user.user === formData.user)) {
			setErrors(['Nome de usuário já cadastrado'])
			setLoading(false)
			return
		}

		formData.id = (users[users.length - 1]?.id ?? 0) + 1;
		users?.push(formData)
		await localforage.setItem('users', users)

		if (onClose) onClose()
		handleClose()
		setSuccess(false)
	}

	const handleOpen = async () => setOpen(true)

	const handleClose = () => {
		setOpen(false)
		setErrors([])
		setSuccess(false)
		setLoading(false)
		setFormData({
			id: 0,
			user: '',
			name: '',
			email: '',
			phone: '',
			password: ''
		})
		if (onClose) onClose()
	}

	return (
		<div>
			<Button variant="outlined" onClick={handleOpen}>
				{props.button}
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				sx={{ overflow: 'scroll' }}
			>
				<Box sx={style}>
					<Typography
						component="h1"
						variant="h4"
						sx={{ color: 'text.primary' }}
					>
						{props.button}
					</Typography>
					<Box
						sx={{
							display:
								success || loading || errors.length > 0
									? 'flex'
									: 'none',
							flexDirection: 'column'
						}}
					>
						<StyledFade
							in={loading}
							sx={{ display: loading ? 'flex' : 'none' }}
						>
							<CircularProgress />
						</StyledFade>
						<StyledFade
							in={success}
							sx={{ display: success ? 'flex' : 'none' }}
						>
							<Alert severity="success" sx={{ mb: 2 }}>
								<AlertTitle>
									Empresa salva com sucesso!
								</AlertTitle>
							</Alert>
						</StyledFade>
						{errors.map(error => (
							<Alert severity="error" sx={{ mb: 2 }} key={error}>
								<AlertTitle>{error}</AlertTitle>
							</Alert>
						))}
					</Box>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<TextField
									autoComplete="given-user"
									name="user"
									required
									fullWidth
									id="user"
									label="Usuário"
									value={formData.user}
									onChange={handleChange}
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="given-name"
									name="name"
									required
									fullWidth
									id="name"
									label="Nome"
									value={formData.name}
									onChange={handleChange}
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="email"
									label="E-mail"
									type="email"
									id="email"
									value={formData.email}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									required
									fullWidth
									name="phone"
									label="Telefone"
									type="phone"
									id="phone"
									value={formData.phone}
									onChange={event => handleChange(event, 15)}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									required
									fullWidth
									name="password"
									label="Senha"
									type="password"
									id="password"
									value={formData.password}
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								type="button"
								fullWidth
								variant="outlined"
								sx={{ mt: 3, mb: 2 }}
								color="error"
								onClick={handleClose}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								fullWidth
								variant="outlined"
								sx={{ mt: 3, mb: 2 }}
								color="success"
							>
								Enviar
							</Button>
						</Box>
					</Box>
				</Box>
			</Modal>
		</div>
	)
}

export default ModalCadastrar
