import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../AppConfig.json"
import { exportCategoriesToPDF } from "./Exports";

interface category {
    idcategory: number,
    nameCategory: string,
    characteristics: [
      {
        idcharacteristic: number,
        nameCharacteristic: string
      }
    ]
  }

const API_URL = config.API_URL;


const CatList = () => {
  const [cats, setCategories] = useState<category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${API_URL}/Categories/user-categories`, {withCredentials:true})
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories.");
        setLoading(false);
      });
  }, []);

  // filtration
  useEffect(() => {
    let filtered = cats;


    if (searchQuery) {
      filtered = filtered.filter((cat) =>
        cat.nameCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [searchQuery, cats])
  if (loading) return <p className="loading-message">Loading categories...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="cat-list-container">
      <h2 className="cat-list-title">User's Categories</h2>

      {/* filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        
      </div>

      {/*category grid */}
      <div className="cat-grid">
        <button className="create-category-button" onClick={() => console.log("placeholder-create-category")}>New</button>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div key={cat.idcategory} className="cat-id">
              <h3 className="cat-name">Category "{cat.nameCategory}"</h3>
              <h5>ID: {cat.idcategory}</h5>
              <h5>Characteristics:</h5>
              <p className="cat-characteristics">
              {cat.characteristics && cat.characteristics.length > 0 ? (
              cat.characteristics.map((char) => (
              <span key={char.idcharacteristic}>
                {char.nameCharacteristic}
                <br />
              </span>
            ))
          ) : (
            <em>No characteristics available.</em>
          )}
        </p>
              <button
                onClick={() => navigate(`/category/${cat.idcategory}`)}
                className="details-button"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No categories match your filters.</p>
        )}
      </div>
      <br/><br/>
      <button onClick={() => exportCategoriesToPDF(filteredCategories)} className="export-button">
      Export this to PDF
    </button>
    </div>
    
  );
};

export default CatList;
