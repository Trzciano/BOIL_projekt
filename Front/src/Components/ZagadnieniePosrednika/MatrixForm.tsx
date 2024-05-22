import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

const MatrixForm = () => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState(
    Array.from({ length: 0 }, () => Array(0).fill(""))
  );

  const handleInputChange = (e: any, rowIdx: number, colIdx: number) => {
    const newMatrix = matrix.map((row, rIdx) =>
      row.map((col, cIdx) =>
        rIdx === rowIdx && cIdx === colIdx ? e.target.value : col
      )
    );
    setMatrix(newMatrix);
  };

  const handleRowChange = (e: any) => {
    const newRows = parseInt(e.target.value, 10) + 2; // Dodajemy 2 do liczby wierszy
    setRows(newRows);
    const newMatrix = Array.from({ length: newRows }, () =>
      Array(cols).fill("")
    );
    setMatrix(newMatrix);
  };

  const handleColChange = (e: any) => {
    const newCols = parseInt(e.target.value, 10) + 2; // Dodajemy 2 do liczby kolumn
    setCols(newCols);
    const newMatrix = Array.from({ length: rows }, () =>
      Array(newCols).fill("")
    );
    setMatrix(newMatrix);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const matrixJson = JSON.stringify(matrix);
    console.log("Matrix:", matrixJson);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2} sx={{ marginBottom: "50px" }}>
        <Grid item xs={6}>
          <TextField
            label="Ilość dostawców"
            type="number"
            value={rows - 2} // Odejmujemy 2, aby pokazać rzeczywistą ilość użytkownikowi
            onChange={handleRowChange}
            InputProps={{ inputProps: { min: 1 } }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Ilość odbiorców"
            type="number"
            value={cols - 2} // Odejmujemy 2, aby pokazać rzeczywistą ilość użytkownikowi
            onChange={handleColChange}
            InputProps={{ inputProps: { min: 1 } }}
            fullWidth
          />
        </Grid>
      </Grid>
      {rows > 2 && cols > 2 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {matrix.map((row, rowIdx) => (
              <Grid item xs={12} key={rowIdx}>
                <Grid container spacing={1}>
                  {row.map((col, colIdx) => (
                    <Grid item xs key={colIdx}>
                      {rowIdx === 0 && colIdx === 0 ? (
                        <Box sx={{ position: "relative" }}>
                          <Typography
                            variant="body1"
                            sx={{ position: "absolute", top: 40, left: 0 }}
                          >
                            Sprzedawcy
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ position: "absolute", top: 0, right: 0 }}
                          >
                            Zapotrzebowanie
                          </Typography>
                        </Box>
                      ) : rowIdx === 0 && colIdx === cols - 1 ? (
                        <Box sx={{ position: "relative" }}>
                          <Typography
                            variant="body1"
                            sx={{ position: "absolute", top: 40, right: 0 }}
                          >
                            Cena zakupu
                          </Typography>
                        </Box>
                      ) : rowIdx === rows - 1 && colIdx === 0 ? (
                        <Box sx={{ position: "relative" }}>
                          <Typography
                            variant="body1"
                            sx={{ position: "absolute", top: 30, right: 0 }}
                          >
                            Cena sprzedaży
                          </Typography>
                        </Box>
                      ) : rowIdx === rows - 1 && colIdx === cols - 1 ? (
                        <Box sx={{ position: "relative" }}>
                          <></>
                        </Box>
                      ) : rowIdx === 0 ? (
                        <TextField
                          label={`Klient ${colIdx}`}
                          value={matrix[rowIdx][colIdx]}
                          onChange={(e) => handleInputChange(e, rowIdx, colIdx)}
                          fullWidth
                          type="number"
                        />
                      ) : colIdx === 0 ? (
                        <TextField
                          label={`Dostawca ${rowIdx}`}
                          value={matrix[rowIdx][colIdx]}
                          onChange={(e) => handleInputChange(e, rowIdx, colIdx)}
                          fullWidth
                          type="number"
                        />
                      ) : (
                        <TextField
                          value={matrix[rowIdx][colIdx]}
                          onChange={(e) => handleInputChange(e, rowIdx, colIdx)}
                          fullWidth
                          type="number"
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Submit
      </Button>
    </Box>
  );
};

export default MatrixForm;
