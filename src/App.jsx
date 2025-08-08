import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginPage";
import DashboardPage from "./components/HomePage";
import AnalystPage from "./components/Analytics";

function App() {    
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyst" element={<AnalystPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;