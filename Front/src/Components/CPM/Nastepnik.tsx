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
  TextField,
  Typography,
} from "@mui/material";

interface CPMModelNext {
  name: string;
  time: number;
  prev: number;
  next: number;
}

const Nastepniki = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModelNext[]>([]);

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

  const removeIngredient = (indexToRemove: number) => {
    setcpmModelRows((prevList) => {
      const updatedList = prevList.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedList;
    });
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
                  onClick={() => removeIngredient(index)}
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
      <Box>Tutaj będą grafy</Box>
    </Container>
  );
};
export default Nastepniki;
