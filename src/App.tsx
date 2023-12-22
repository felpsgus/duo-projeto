import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Registrar from "./components/Registrar";
import Login from "./components/Login";
import ModalCadastrar from "./components/ModalCadastrar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar" element={<ModalCadastrar />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
