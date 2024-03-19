import { Button, Container, Typography } from "@mui/material";
import Poprzednik from "./Poprzednik";
import { useState } from "react";
import Nastepniki from "./Nastepnik";

const CPM = () => {
  const [isToggled, setIsToggled] = useState(true);

  const handleClick = () => {
    setIsToggled((prevState) => !prevState);
  };
  return (
    <Container
      maxWidth="lg"
      sx={{ heiht: "100vh", paddingBottom: "30px", marginTop: "10vh" }}
    >
      <Typography variant="h3" marginTop={4} style={{ width: "100%" }}>
        Metoda CPM
      </Typography>

      <Button variant="contained" onClick={handleClick}>
        {isToggled ? "Zmiana na Następniki" : "Zmiana na Poprzedniki"}
      </Button>

      {isToggled ? <Poprzednik /> : <Nastepniki />}
    </Container>
  );
};

export default CPM;
