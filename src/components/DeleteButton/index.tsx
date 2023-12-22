import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Button, ButtonProps } from '@mui/material'
import * as React from 'react'
import localforage from 'localforage'

interface DeleteButtonProps extends ButtonProps {
	row: {
		id: number
	}
	func: () => void
}

interface FormData {
	id?: number
}

const DeleteButton: React.FC<DeleteButtonProps> = props => {
	const { row, func } = props
	const handleDeletion = async (id: number) => {

		const users = (await localforage.getItem<FormData[]>('users')) || []

		const updatedUsers = users.filter(u => u.id !== id)
		await localforage.setItem('users', updatedUsers)

		func()
	}

	return (
		<Button
			startIcon={<DeleteOutlineIcon />}
			variant="outlined"
			color="error"
			onClick={() => handleDeletion(row.id)}
		>
			Excluir
		</Button>
	)
}

export default DeleteButton
