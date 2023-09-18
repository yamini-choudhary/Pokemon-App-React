import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";

export function App() {
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [nextPokenmonUrl, setnextPokenmonUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPokemon, setselectedPokemon] = useState(null);

  async function getAllPokemons(
    url = "https://content.newtonschool.co/v1/pr/64ccef982071a9ad01d36ff6/pokemonspages1",
    override = false
  ) {
    const res = await axios.get(url);
    const pokemonData = res.data[0].results;
    setnextPokenmonUrl(res.data[0].next);
    const pokemonListFromApi = [];
    for (const pokemon of pokemonData) {
      const res = await axios.get(pokemon.url);
      const data = res.data[0];
      pokemonListFromApi.push(data);
    }
    console.log(pokemonListFromApi);
    if (!override) {
      setPokemonList(pokemonListFromApi);
    } else {
      setPokemonList((oldList) => {
        return oldList.concat(pokemonListFromApi);
      });
    }
    setLoading(false);
  }

  function handleShowMore() {
    getAllPokemons(nextPokenmonUrl, true);
  }

  useEffect(() => {
    getAllPokemons();
  }, []);

  return loading ? (
    <div>loading</div>
  ) : (
    <div id="parent">
      <div id="section">
        <h2>Pokemon KingDom</h2>
        <h2>Pokemon KingDom</h2>
      </div>

      <div className="modal" id={!showModal && "inactive"}>
        <div className="content">
          {selectedPokemon !== null && selectedPokemon >= 0 && (
            <div className={`details ${pokemonList[selectedPokemon].type}`}>
              <div id="pokemon-preview">
                <div className="pokemon-info-container">
                  <img
                    src={pokemonList[selectedPokemon].image}
                    alt={pokemonList[selectedPokemon].name}
                  />
                  <div>{pokemonList[selectedPokemon].name}</div>
                </div>
                <div className="pokemon-info">
                  <div className="mesures">
                    <div>
                      <strong>Weight:</strong>{" "}
                      {pokemonList[selectedPokemon].weight}
                    </div>
                    <div>
                      <strong>Height:</strong>{" "}
                      {pokemonList[selectedPokemon].height}
                    </div>
                  </div>
                  <div className="states">
                    <Stats
                      pokemonStatsList={pokemonList[selectedPokemon].stats}
                    />
                    <BaseStats
                      pokemonStatsList={pokemonList[selectedPokemon].stats}
                    />
                  </div>
                </div>
              </div>
              <div
                id="close"
                onClick={() => {
                  setShowModal(false);
                  setselectedPokemon(null);
                }}
              >
                x
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="app-container" id="no-scrool">
        <div className="pokemon-container">
          {pokemonList.map((pokemon, index) => {
            return (
              <div className={`card ${pokemon.type}`}>
                <div className="number">{`#${pokemon.id}`}</div>
                <img src={pokemon.image} alt={pokemon.name} />
                <div className="details">
                  <h3>{pokemon.name}</h3>
                  <small>Type: {pokemon.type}</small>
                </div>
                <div>
                  <button
                    className="btn fancy"
                    onClick={() => {
                      setShowModal(true);
                      setselectedPokemon(index);
                    }}
                  >
                    Know more...
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="center">
        <div>
          <button className="btn fancy" onClick={handleShowMore}>
            Show more
          </button>
        </div>
      </div>
    </div>
  );
}
function Stats({ pokemonStatsList }) {
  return (
    <div className="pokemon-info--section">
      {pokemonStatsList.map((pokemonStat, index) => (
        <div>
          <strong>{`Stat${index + 1}`}:</strong> {pokemonStat.stat.name}
        </div>
      ))}
    </div>
  );
}
function BaseStats({ pokemonStatsList }) {
  return (
    <div className="pokemon-info--section">
      {pokemonStatsList.map((pokemonStat, index) => (
        <div>
          <strong>{`Bs${index + 1}`}:</strong> {pokemonStat.base_stat}
        </div>
      ))}
    </div>
  );
}
