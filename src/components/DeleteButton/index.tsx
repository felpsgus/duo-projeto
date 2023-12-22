import axios from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, ButtonProps } from "@mui/material";
import * as React from "react";
import localforage from "localforage";

interface DeleteButtonProps extends ButtonProps {
  row: {
    id_empresa: number;
  };
  func: () => void;
}

interface Token {
  access_token: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { row, func } = props;
  const handleDeletion = async (id: number) => {
    const value: Token | null = await localforage.getItem("token");

    if (!value || !value.access_token) {
      window.location.href = "/login";
      return;
    }
    const response = await axios
      .delete("http://localhost:8000/api/v1/empresas/" + id, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${value.access_token}`,
        },
      })
      .then((response) => {
        func();
      });

    return response;
  };

  return (
    <Button
      startIcon={<DeleteOutlineIcon />}
      variant="outlined"
      color="error"
      onClick={() => handleDeletion(row.id_empresa)}
    >
      Excluir
    </Button>
  );
};

export default DeleteButton;
