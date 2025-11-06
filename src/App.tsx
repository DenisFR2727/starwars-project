import HeroesListPage from "./pages/HeroesListPage";
import "./styles/globals.css";

function App() {
  return (
    <div className="App">
      <h1>Star Wars</h1>
      <div className="heroes_content">
        <HeroesListPage />
      </div>
    </div>
  );
}

export default App;
