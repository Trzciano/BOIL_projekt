import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { APIpost } from "../../api/api";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  Table,
  TableBody,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const Poprzednik = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModel[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [returnedData, setReturnedData] = useState<ReturnType[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [indexToEdit, setIndexToEdit] = useState(0);

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

  const editValidateName = (value: string) => {
    const isDuplicate = cpmModelRows.some((item) => item.action === value);
    if (isDuplicate) {
      if (value == cpmModelRows.at(indexToEdit)?.action) {
        return true;
      }
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
      setAutocompleteKey((prevKey) => prevKey + 1);

      setSelectedOptions([]);
    } catch (error: any) {
      console.error("Błąd:", error);
    }
  };

  const onRowEdit = async (data: CPMModel) => {
    try {
      data.actions_before = selectedOptions;
      setSelectedOptions([]);

      setcpmModelRows((prevList) => {
        return prevList.map((item, currentIndex) => {
          if (currentIndex === indexToEdit) {
            return data; // Zamień obiekt na indeksie index na nowy obiekt data
          }
          return item; // Zachowaj inne obiekty bez zmian
        });
      });

      reset();
      setValue("actions_before", []);
      setAutocompleteKey((prevKey) => prevKey + 1);

      setSelectedOptions([]);
      setEditMode(false);
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

  const edit = (indexToedit: number) => {
    setEditMode(true);
    setIndexToEdit(indexToedit);

    const editedItem = cpmModelRows.at(indexToedit);
    setValue("action", editedItem?.action!);
    setValue("duration", editedItem?.duration!);
    setValue("actions_before", editedItem?.actions_before!);
    setSelectedOptions(editedItem?.actions_before!);
    setAutocompleteKey(indexToEdit);
  };

  const convertToConvertedType = (cpmModels: CPMModel[]): ConvertedType => {
    const cpm_table = cpmModels.map((cpmModel) => ({
      action: cpmModel.action,
      duration: Number(cpmModel.duration),
      actions_before: cpmModel.actions_before.join(""),
    }));

    return { cpm_table };
  };

  const sendData = async () => {
    const data = convertToConvertedType(cpmModelRows);

    const return_data = await APIpost<ConvertedType, ReturnType[]>(
      "cpmtable_left",
      data
    );

    if (return_data) setReturnedData(return_data);
  };

  const rowStyle = (rowData: ReturnType) => {
    return rowData.is_critical ? { backgroundColor: "#FFD700" } : {};
  };

  const deleteAll = () => {
    reset();
    setValue("actions_before", []);
    setAutocompleteKey((prevKey) => prevKey + 1);

    setSelectedOptions([]);
    setEditMode(false);
    setcpmModelRows([]);
    setReturnedData([]);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ heiht: "100vh", paddingBottom: "30px", marginTop: "10vh" }}
    >
      <form>
        <Typography variant="h6" component="span" marginTop={4}>
          {editMode ? "Edytuj wiersz" : "Nowy Wiersz"}
        </Typography>
        {!editMode ? (
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
              key={autocompleteKey}
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
        ) : (
          <Box display="flex">
            <TextField
              {...register("action", {
                required: "Pole jest wymagane",
                validate: editValidateName,
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
              key={autocompleteKey}
              id="poprzednika-autocomplete"
              options={cpmModelRows}
              onChange={handleAutocompleteChange}
              defaultValue={cpmModelRows.filter((obiekt) =>
                cpmModelRows
                  .at(indexToEdit)
                  ?.actions_before!.includes(obiekt.action)
              )}
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
        )}

        {!editMode ? (
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
        ) : (
          <Button
            onClick={handleSubmit(onRowEdit)}
            type="button"
            variant="contained"
            color="primary"
            sx={{ width: "100px", marginTop: "4px" }}
          >
            <SaveIcon />
            Zapisz
          </Button>
        )}
        <Button
          onClick={deleteAll}
          type="button"
          variant="contained"
          color="error"
          sx={{ width: "100px", marginTop: "4px" }}
        >
          <DeleteIcon />
          Wyczyść
        </Button>

        <List>
          {cpmModelRows.map((row, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => edit(index)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
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

      <Box sx={{ marginTop: "40px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* <TableCell>Source</TableCell>
                <TableCell>Target</TableCell> */}
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
                  {/* <TableCell>{row.source.toString()}</TableCell>
                  <TableCell>{row.target.toString()}</TableCell> */}
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

export default Poprzednik;
