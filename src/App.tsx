import { BrowserRouter, Route, Routes } from "react-router";
import HeroesListPage from "./pages/HeroesListPage";
import HeroDetailsPage from "./pages/HeroDetailsPage";

import "./styles/globals.css";

function App() {
  return (
    <div className="App">
      <h1>Star Wars</h1>
      <div className="heroes_content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HeroesListPage />} />
            <Route path="/hero-id/:id" element={<HeroDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
