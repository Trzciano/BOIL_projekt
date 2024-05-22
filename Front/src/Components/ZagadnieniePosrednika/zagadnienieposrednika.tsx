import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import MatrixForm from "./MatrixForm";

interface Konfiguracja {
  ilosc_dostawcow: number;
  ilosc_odbiorcow: number;
}

const ZagadnieniePosrednika = () => {
  const [konfiguracja, setKonfiguracja] = useState<Konfiguracja>();
  const [matrixData, setMatrixData] = useState<number[][] | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Konfiguracja>();

  const onKonfiguracjaSave = async (data: Konfiguracja) => {
    try {
      setKonfiguracja(data);
      reset();
    } catch (error: any) {
      console.error("Błąd:", error);
    }
  };

  const handleMatrixSubmit = (matrix: number[][]) => {
    setMatrixData(matrix);
    console.log("Submitted matrix:", matrix);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ height: "100vh", paddingBottom: "30px", marginTop: "10vh" }}
    >
      <Typography
        variant="h3"
        marginTop={4}
        style={{ width: "100%", marginBottom: "20px" }}
      >
        Zagadnienie pośrednika
      </Typography>
      <Typography variant="h6" component="span">
        Konfiguracja
      </Typography>
      <MatrixForm />
    </Container>
  );
};

export default ZagadnieniePosrednika;
