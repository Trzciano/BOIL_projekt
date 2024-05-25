import { Container, Typography } from "@mui/material";
import { useState } from "react";
import MatrixForm from "./MatrixForm";
import TransportMatrixVisualization from "./TransportMatrixVisualization";

export interface Returned_Type {
  transport_matrix: number[][];
  result_transport: number;
  result_from_selling: number;
  result_from_buying: number;
  profit: number;
}

const ZagadnieniePosrednika = () => {
  const [result, setResult] = useState<Returned_Type | null>(null);

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
      <MatrixForm saveResult={setResult} />

      {result && <TransportMatrixVisualization data={result} />}
    </Container>
  );
};

export default ZagadnieniePosrednika;
