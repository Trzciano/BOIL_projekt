import {useRef, useState, useCallback, useEffect} from "react";
import { useForm } from "react-hook-form";
import { APIImageGet, APIpost } from "../../api/api";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
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
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge, Node, Edge, Connection,
} from 'reactflow';

import 'reactflow/dist/style.css';
import dagre from "dagre";

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
  actions_before: string;
}

const Poprzednik = () => {
  const [cpmModelRows, setcpmModelRows] = useState<CPMModel[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [returnedData, setReturnedData] = useState<ReturnType[]>([]);
  const [imageData, setImageData] = useState<string | null>(null);

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

    if (return_data) {
      setReturnedData(return_data);

      const imageUrl = URL.createObjectURL(await APIImageGet());
      setImageData(imageUrl);
    }
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
    setImageData(null);
  };

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { nodes, edges } = createNodesAndEdges(returnedData);
    const updatedNodes = layoutNodes(nodes, edges);
    setNodes(updatedNodes);
    setEdges(edges);
  }, [returnedData]);

  const createNodesAndEdges = (data: ReturnType[]): { nodes: Node[]; edges: Edge[] } => {
    console.log('Input data:', JSON.stringify(data, null, 2)); // Log the input data

    if (!data) {
      console.error('Data is undefined or null');
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create mapping of action names to node indices
    const actionToNodeIndex: { [key: string]: string } = {};

    let edgeId = 0; // Define edgeId at the top of your function

    // Create nodes and initial edges
    data.forEach((row: any, index) => { // Use 'any' type for row
      console.log('Processing row:', JSON.stringify(row, null, 2)); // Log the current row

      const nodeId = (index + 1).toString(); // Convert to string
      actionToNodeIndex[row.action] = nodeId;
      const newNode: Node = {
        id: nodeId,
        type: 'default',
        data: { label: nodeId }, // Set label to action name
        position: { x: 100, y: index * 100 + 100 },
      };
      nodes.push(newNode);
      console.log('New node:', JSON.stringify(newNode, null, 2)); // Log the new node
    });
    console.log('Nodes after initial creation:', JSON.stringify(nodes, null, 2)); // Log the nodes after initial creation

    // Create additional edges based on actions_before from CPMModel data
    data.forEach((row, index) => {
      const nodeId = (index + 1).toString(); // Convert to string
      const cpmModel = cpmModelRows.find(model => model.action === row.action);
      if (cpmModel && cpmModel.actions_before && cpmModel.actions_before.length > 0) {
        cpmModel.actions_before.forEach((beforeAction: string) => {
          const sourceNode = actionToNodeIndex[beforeAction] || '1'; // Set to '1' if actions_before does not have a value
          createEdge(sourceNode, nodeId, beforeAction, row, edgeId++);
        });
      } else {
        createEdge('1', nodeId, row.action, row, edgeId++); // If actions_before is not present or empty, set source to '1'
      }
    });

    function createEdge(source: string, target: string, label: string, row: any, edgeIndex: number) {
      const newEdge: Edge = {
        id: `edge-${label}-${edgeIndex}`, // Append the unique edgeId to the edge name
        source: source,
        target: target,
        label: `${label} (Duration: ${row.duration})`,
        style: {
          stroke: row.is_critical ? '#ff0000' : undefined,
        },
      };
      if(source != target) {
        edges.push(newEdge);
        console.log('New edge:', JSON.stringify(newEdge, null, 2)); // Log the new edge
      };
    }

    console.log('Final nodes:', JSON.stringify(nodes, null, 2)); // Log the final nodes
    console.log('Final edges:', JSON.stringify(edges, null, 2)); // Log the final edges

    return { nodes, edges };
  };




  const layoutNodes = (nodes: Node[], edges: Edge[]) => {
    const graph = new dagre.graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));

    graph.setGraph({});

    nodes.forEach((node) => {
      graph.setNode(node.id, { width: 150, height: 50 });
    });

    edges.forEach((edge) => {
      graph.setEdge(edge.source, edge.target);
    });

    dagre.layout(graph);

    const updatedNodes = nodes.map((node) => {
      const updatedNode = graph.node(node.id);
      return {
        ...node,
        position: {
          x: updatedNode.x,
          y: updatedNode.y,
        },
      };
    });
    console.log('Updated nodes:', updatedNodes);

    return updatedNodes;
  };

  // Debugging: Log the states before rendering
  console.log('Nodes state:', nodes);
  console.log('Edges state:', edges);

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
              sx={{ width: "100px", marginTop: "4px", marginLeft: "10px" }}
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
              disabled={cpmModelRows.length < 2}
              onClick={sendData}
              type="button"
              variant="contained"
              color="primary"
              sx={{ width: "100px", marginTop: "4px" }}
          >
            <ModelTrainingIcon />
            Generuj
          </Button>
        </Box>
        <Box sx={{ height: "500px", width: "100%", position: "relative" }}>
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={(params: Connection) => setEdges((eds) => addEdge(params, eds))}
              nodesDraggable={false} // Disable node dragging if needed
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
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
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              {imageData && <img src={imageData} alt="Zdjęcie" />}
          </Box>
      </Container>
  );
};

export default Poprzednik;
