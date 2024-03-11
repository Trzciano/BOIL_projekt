import { useEffect, useState } from "react";
import apiGet from "../../api/api";
import { SubmitHandler, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { CPMModel } from "../../api/CPMModel";
import {
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const CPM = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModel[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CPMModel>();

  const onSubmit: SubmitHandler<CPMModel> = async (data: CPMModel) => {
    try {
      console.log(data);
    } catch (error: any) {
      console.error("Błąd:", error);
    }
  };

  const onRowAdd = async (data: CPMModel) => {
    try {
      setcpmModelRows((prevList) => [...prevList, data]);

      setValue("name", "");
      setValue("time", 0);
      setValue("something", "");
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
      <Typography variant="h3" component="span" marginTop={4}>
        Metoda CPM
      </Typography>
      <form>
        <Typography variant="h6" component="span" marginTop={4}>
          Nowy wiersz
        </Typography>
        <Box>
          <TextField
            {...register("name", { required: "Pole jest wymagane" })}
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
            sx={{ width: "160px", margin: "4px" }}
            select
            label="Poprzednika"
            helperText="Proszę wybrać poprzednika"
            defaultValue={"-"}
            {...register("something", { required: "Pole jest wymagane" })}
          >
            <MenuItem value={"-"}>-</MenuItem>
            {cpmModelRows.map((row, index) => (
              <MenuItem key={index} value={row.name}>
                {row.name}
              </MenuItem>
            ))}
          </TextField>
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
                primary={`Nazwa czynności: ${row.name} Czas trwania: ${row.time} Czynność bezpośrednio poprzedzająca: ${row.something}`}
              />
            </ListItem>
          ))}
        </List>
      </form>
    </Container>
  );
};

export default CPM;
