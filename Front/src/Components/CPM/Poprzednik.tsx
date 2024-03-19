import { useState } from "react";
import { useForm } from "react-hook-form";
import { APIpost } from "../../api/api";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CPMModel } from "../../api/CPMModel";
import {
  Autocomplete,
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

interface ConvertedType {
  cpm_table: {
    action: string;
    duration: number;
    actions_before: string;
  }[];
}

const Poprzednik = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModel[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    value: CPMModel[]
  ) => {
    const selectedNames = value.map((option) => option.action);
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
    const isDuplicate = cpmModelRows.some((item) => item.action === value);
    if (isDuplicate) {
      return "Ta nazwa już istnieje";
    }
    return true;
  };

  const onRowAdd = async (data: CPMModel) => {
    try {
      data.actions_before = selectedOptions;
      setSelectedOptions([]);

      setcpmModelRows((prevList) => [...prevList, data]);

      reset();
      setValue("actions_before", []);
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

  const convertToConvertedType = (cpmModels: CPMModel[]): ConvertedType => {
    const cpm_table = cpmModels.map((cpmModel) => ({
      action: cpmModel.action,
      duration: cpmModel.duration,
      actions_before: cpmModel.actions_before.join(""),
    }));

    return { cpm_table };
  };

  const sendData = async () => {
    const data = convertToConvertedType(cpmModelRows);
    const return_data = APIpost("cpmtable_left", data);

    console.log(return_data);
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
            {...register("action", {
              required: "Pole jest wymagane",
              validate: validateName,
            })}
            label="Nazwa"
            sx={{ marginTop: "4px", marginRight: "8px" }}
            error={!!errors.action}
            helperText={!!errors.action && errors.action.message}
          />
          <TextField
            {...register("duration", {
              required: "Pole jest wymagane",
              min: { value: 1, message: "Czas musi być większy niż 0" },
            })}
            type="number"
            label="Czas"
            sx={{ marginTop: "4px", marginRight: "8px" }}
            error={!!errors.duration}
            helperText={!!errors.duration && errors.duration.message}
          />
          <Autocomplete
            multiple
            id="poprzednika-autocomplete"
            options={cpmModelRows}
            onChange={handleAutocompleteChange}
            getOptionLabel={(option) => option.action}
            renderInput={(params) => (
              <TextField
                sx={{ marginTop: "4px", marginRight: "8px", width: "40vw" }}
                {...params}
                variant="standard"
                label="Poprzednika"
                helperText="Proszę wybrać poprzednika"
                {...register("actions_before")}
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
                primary={`Nazwa czynności: ${row.action} Czas trwania: ${row.duration} Czynność bezpośrednio poprzedzająca: ${row.actions_before}`}
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
    </Container>
  );
};

export default Poprzednik;
