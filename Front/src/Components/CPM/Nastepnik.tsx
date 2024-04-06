import { useState } from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableContainer,
  TextField,
  Typography,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { APIpost } from "../../api/api";

interface CPMModelNext {
  name: string;
  time: number;
  prev: number;
  next: number;
}

interface ConvertedType {
  cpm_table: {
    action: string;
    duration: number;
    sequence: string;
  }[];
}

interface ReturnType {
  source: Number;
  target: Number;
  action: string;
  duration: Number;
  early_start: Number;
  early_finish: Number;
  late_start: Number;
  late_finish: Number;
  reserve: Number;
  is_critical: boolean;
}

const Nastepniki = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModelNext[]>([]);
  const [returnedData, setReturnedData] = useState<ReturnType[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CPMModelNext>();

  // Niestandardowa funkcja walidacji sprawdzająca, czy nowa nazwa już istnieje
  const validateName = (value: string) => {
    const isDuplicate = cpmModelRows.some((item) => item.name === value);
    if (isDuplicate) {
      return "Ta nazwa już istnieje";
    }
    return true;
  };

  const onRowAdd = async (data: CPMModelNext) => {
    try {
      setcpmModelRows((prevList) => [...prevList, data]);

      reset();
    } catch (error: any) {
      console.error("Błąd:", error);
    }
  };

  const remove = (indexToRemove: number) => {
    setcpmModelRows((prevList) => {
      const updatedList = prevList.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedList;
    });
  };

  const convertToConvertedType = (cpmModels: CPMModelNext[]): ConvertedType => {
    const cpm_table = cpmModels.map((cpmModel) => ({
      action: cpmModel.name,
      duration: Number(cpmModel.time),
      sequence: `${cpmModel.prev}-${cpmModel.next}`,
    }));
    return { cpm_table };
  };

  const sendData = async () => {
    console.log(cpmModelRows);
    const data = convertToConvertedType(cpmModelRows);

    const return_data = await APIpost<ConvertedType, ReturnType[]>(
      "cpmtable_right",
      data
    );

    if (return_data) setReturnedData(return_data);
  };

  const rowStyle = (rowData: ReturnType) => {
    return rowData.is_critical ? { backgroundColor: "#FFD700" } : {};
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ heiht: "100vh", paddingBottom: "30px", marginTop: "10vh" }}
    >
      <form>
        <Typography variant="h6" component="span" marginTop={4}>
          Nowy wiersz
        </Typography>
        <Box display="flex">
          <TextField
            {...register("name", {
              required: "Pole jest wymagane",
              validate: validateName,
            })}
            label="Nazwa"
            sx={{ marginTop: "4px", marginRight: "8px" }}
            error={!!errors.name}
            helperText={!!errors.name && errors.name.message}
          />
          <TextField
            {...register("time", {
              required: "Pole jest wymagane",
              min: { value: 1, message: "Czas musi być większy niż 0" },
            })}
            type="number"
            label="Czas"
            sx={{ marginTop: "4px", marginRight: "8px" }}
            error={!!errors.time}
            helperText={!!errors.time && errors.time.message}
          />
          <TextField
            {...register("prev", {
              required: "Pole jest wymagane",
              min: { value: 1, message: "Pole musi być większe niż 0" },
              max: {
                value: cpmModelRows.length + 1,
                message: `Pole musi być większy niż ${cpmModelRows.length + 2}`,
              },
            })}
            type="number"
            label="Przed"
            sx={{ marginTop: "4px", marginRight: "8px" }}
            error={!!errors.prev}
            helperText={!!errors.prev && errors.prev.message}
          />{" "}
          <TextField
            {...register("next", {
              required: "Pole jest wymagane",
              min: { value: 1, message: "Pole musi być większe niż 0" },
              max: {
                value: cpmModelRows.length + 2,
                message: `Pole musi być mniejsze niż ${
                  cpmModelRows.length + 3
                }`,
              },
            })}
            type="number"
            label="Po"
            sx={{ marginTop: "4px", marginRight: "8px" }}
            error={!!errors.next}
            helperText={!!errors.next && errors.next.message}
          />
        </Box>
        <Button
          onClick={handleSubmit(onRowAdd)}
          type="button"
          variant="contained"
          color="primary"
          sx={{ width: "100px", marginTop: "4px" }}
        >
          <AddIcon />
          Dodaj
        </Button>

        <List>
          {cpmModelRows.map((row, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`Nazwa czynności: ${row.name} Czas trwania: ${row.time} Następstwo zdarzeń: ${row.prev} - ${row.next}`}
              />
            </ListItem>
          ))}
        </List>
      </form>
      <Box>
        <Button
          onClick={sendData}
          type="button"
          variant="contained"
          color="primary"
          sx={{ width: "100px", marginTop: "4px" }}
        >
          <AddIcon />
          Generuj
        </Button>
      </Box>
      <Box sx={{ marginTop: "40px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Early Start</TableCell>
                <TableCell>Early Finish</TableCell>
                <TableCell>Late Start</TableCell>
                <TableCell>Late Finish</TableCell>
                <TableCell>Reserve</TableCell>
                <TableCell>Is Critical</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returnedData.map((row, index) => (
                <TableRow key={index} sx={rowStyle(row)}>
                  <TableCell>{row.source.toString()}</TableCell>
                  <TableCell>{row.target.toString()}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.duration.toString()}</TableCell>
                  <TableCell>{row.early_start.toString()}</TableCell>
                  <TableCell>{row.early_finish.toString()}</TableCell>
                  <TableCell>{row.late_start.toString()}</TableCell>
                  <TableCell>{row.late_finish.toString()}</TableCell>
                  <TableCell>{row.reserve.toString()}</TableCell>
                  <TableCell>{row.is_critical.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};
export default Nastepniki;
