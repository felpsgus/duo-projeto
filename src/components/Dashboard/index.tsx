import {
	Alert,
	AlertTitle,
	Box,
	Container,
	Fade,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	styled
} from '@mui/material'
import localforage from 'localforage'
import { useState } from 'react'
import * as React from 'react'
import ModalCadastrar from '../ModalCadastrar'
import DeleteButton from '../DeleteButton'
import ModalPerfil from '../ModalPerfil'
import Logout from '../Logout'

interface UserData {
	id: number
	name: string
	user: string
	cnpj: string
	email: string
	phone: string
}

const StyledFade = styled(Fade)({
	display: 'flex'
})

export default function Dashboard() {
	const [data, setData] = React.useState<UserData[]>([])
	const [success, setSuccess] = useState(false)
	const [filtro, setFiltro] = useState('')

	const fetchData = React.useCallback(async () => {
		try {
			var isLogged = await localforage.getItem('userLogged')
			if (!isLogged) {
				window.location.href = '/login'
			}
			const storedData = await localforage.getItem<UserData[]>('users')
			if (storedData) {
				setData(storedData)
			}
		} catch (error) {
			console.error('Error fetching data from local storage:', error)
		}
	}, [setData])

	React.useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleUpdate = React.useCallback(() => {
		fetchData()
	}, [fetchData])

	const handleDeletion = React.useCallback(() => {
		setSuccess(true)
		fetchData()
		setTimeout(() => {
			setSuccess(false)
		}, 3000)
	}, [fetchData, setSuccess])

	const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFiltro(event.target.value)
	}

	const filteredData = data.filter((row: UserData) => {
		return row.name.toLowerCase().includes(filtro.toLowerCase())
	})

	return (
		<Container component="main" sx={{ bgcolor: 'background.default' }}>
			<Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mt: 2
					}}
				>
					<Typography
						component="h1"
						variant="h4"
						sx={{ color: 'text.primary' }}
					>
						Dashboard
					</Typography>
					<StyledFade
						in={success}
						sx={{ display: success ? 'flex' : 'none' }}
					>
						<Alert severity="success" sx={{ mb: 2 }}>
							<AlertTitle>
								Usuário deletado com sucesso!
							</AlertTitle>
						</Alert>
					</StyledFade>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Logout />
						<ModalPerfil button="Perfil" onClose={handleUpdate} />
						<ModalCadastrar
							button="Cadastrar"
							onClose={handleUpdate}
						/>
					</Box>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							sx={{
								mt: 2
							}}
							fullWidth
							label="Filtro por nome"
							value={filtro}
							onChange={handleFilter}
							autoFocus
						/>
					</Grid>
				</Grid>
				<TableContainer component={Paper} sx={{ mt: 3 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 700 }}>
									Usuário
								</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>
									Nome
								</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>
									Email
								</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>
									Telefone
								</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredData.map(row => (
								<TableRow key={row.id}>
									<TableCell>{row.user}</TableCell>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row.email}</TableCell>
									<TableCell>{row.phone}</TableCell>
									<TableCell
										align="right"
										sx={{ width: 150 }}
									>
										<Box sx={{ display: 'flex', gap: 2 }}>
											<DeleteButton
												row={row}
												func={handleDeletion}
											/>
										</Box>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	)
}
