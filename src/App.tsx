import HeroesList from "./components/heroes-list/heroes-list";

import "./styles/globals.css";

function App() {
  return (
    <div className="App">
      <h1>Star Wars</h1>
      <div className="heroes_content">
        <HeroesList />
      </div>
    </div>
  );
}

export default App;
