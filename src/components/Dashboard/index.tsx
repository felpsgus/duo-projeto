import {
	Alert,
	AlertTitle,
	Avatar,
	Box,
	Button,
	Container,
	Fade,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	styled
} from '@mui/material'
import localforage from 'localforage'
import axios from 'axios'
import { useState } from 'react'
import * as React from 'react'
import ModalCadastrar from '../ModalCadastrar'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import DeleteButton from '../DeleteButton'
import ModalAtualizar from '../ModalAtualizar'
import Logout from '../Logout'

interface CompanyData {
	id_empresa: number
	nome: string
	cnpj: string
	email: string
	telefone: string
	logo: string
}

const StyledFade = styled(Fade)({
	display: 'flex'
})

export default function Dashboard() {
	const [data, setData] = React.useState<CompanyData[]>([])
	const [success, setSuccess] = useState(false)

	const fetchData = React.useCallback(async () => {
		try {
			const value: { access_token: string } | null =
				await localforage.getItem('token')

			if (!value || !value.access_token) {
				window.location.href = '/login'
				return
			}

			const response = await axios.get<{ data: CompanyData[] }>(
				'http://localhost:8000/api/v1/empresas/',
				{
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${value.access_token}`
					}
				}
			)

			setData(response.data.data)
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				window.location.href = '/login'
			} else {
				console.error('Erro ao buscar empresas:', error)
			}
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
								Empresa deletada com sucesso!
							</AlertTitle>
						</Alert>
					</StyledFade>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Logout />
						<Button variant="outlined" onClick={handleUpdate}>
							Atualizar
						</Button>
						<ModalCadastrar
							button="Cadastrar"
							onClose={handleUpdate}
						/>
					</Box>
				</Box>
				<TableContainer component={Paper} sx={{ mt: 3 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 700 }}>
									Logo
								</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>
									Nome
								</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>
									CNPJ
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
							{data.map(row => (
								<TableRow key={row.id_empresa}>
									<TableCell component="th" scope="row">
										<Avatar alt={row.nome} src={row.logo} />
									</TableCell>
									<TableCell>{row.nome}</TableCell>
									<TableCell>{row.cnpj}</TableCell>
									<TableCell>{row.email}</TableCell>
									<TableCell>{row.telefone}</TableCell>
									<TableCell
										align="right"
										sx={{ width: 300 }}
									>
										<Box sx={{ display: 'flex', gap: 2 }}>
											<ModalAtualizar
												onClose={handleUpdate}
												button="Editar"
												data={row}
												icon={<CreateOutlinedIcon />}
											/>
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
