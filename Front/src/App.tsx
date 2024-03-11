import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Pages from "./Common/pages";
import CPM from "./Components/CPM/CPM";
import Header from "./Components/Header/header";
import ZagadnieniePosrednika from "./Components/ZagadnieniePosrednika/zagadnienieposrednika";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={Pages.CPM} element={<CPM />} />
        <Route
          path={Pages.ZAGADNIENIE_POSREDNIKA}
          element={<ZagadnieniePosrednika />}
        />
        <Route path="*" element={<Navigate to={Pages.CPM} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
