import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import Pages from "../../Common/pages";
import pages from "../../Common/pages";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCPMClick = () => {
    navigate(Pages.CPM);
  };

  const handleZPClick = () => {
    navigate(Pages.ZAGADNIENIE_POSREDNIKA);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 99,
      }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h4"
            component="h4"
            sx={{ flexGrow: 1, cursor: "default" }}
          >
            Projekt BOIL
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              key={pages.CPM}
              onClick={handleCPMClick}
              size="large"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              CPM
            </Button>
            <Button
              key={pages.ZAGADNIENIE_POSREDNIKA}
              onClick={handleZPClick}
              size="large"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Zagadnienie pośrednika
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
