import { useEffect, useState } from "react";
import apiGet from "../../api/api";
import { SubmitHandler, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CPMModel } from "../../api/CPMModel";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const Poprzednik = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModel[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    value: CPMModel[]
  ) => {
    const selectedNames = value.map((option) => option.name);
    setSelectedOptions(selectedNames);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CPMModel>();

  const validateName = (value: string) => {
    const isDuplicate = cpmModelRows.some((item) => item.name === value);
    if (isDuplicate) {
      return "Ta nazwa już istnieje";
    }
    return true;
  };

  const onSubmit: SubmitHandler<CPMModel> = async (data: CPMModel) => {
    try {
      console.log(data);
    } catch (error: any) {
      console.error("Błąd:", error);
    }
  };

  const onRowAdd = async (data: CPMModel) => {
    try {
      data.pn = selectedOptions;
      setSelectedOptions([]);

      setcpmModelRows((prevList) => [...prevList, data]);

      reset();
      setValue("pn", []);
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
          <Autocomplete
            multiple
            id="poprzednika-autocomplete"
            options={cpmModelRows}
            onChange={handleAutocompleteChange}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                sx={{ marginTop: "4px", marginRight: "8px", width: "40vw" }}
                {...params}
                variant="standard"
                label="Poprzednika"
                helperText="Proszę wybrać poprzednika"
                {...register("pn")}
              />
            )}
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
                primary={`Nazwa czynności: ${row.name} Czas trwania: ${row.time} Czynność bezpośrednio poprzedzająca: ${row.pn}`}
              />
            </ListItem>
          ))}
        </List>
      </form>
      <Box>Tutaj będą grafy</Box>
    </Container>
  );
};
export default Poprzednik;
