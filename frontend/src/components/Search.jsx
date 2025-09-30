import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Search = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(null);
  const [waite, setWaite] = useState(false);

  function handleSearch() {
    // Implement search logic here
    setWaite(true);
    setProducts(null);
    if (!searchTerm.trim()) {
      return alert("الرجاء ادخال كلمة للبحث...");
    }

    axios
      .get(`/api/user/search?query=${searchTerm}`)
      .then((response) => {
        setProducts(response.data);
        setWaite(false);
      })
      .catch((error) => {
        console.error("There was an error searching!", error);
        setWaite(false);
      });
  }

  return (
    <div className="search">
      <div className="theSearch">
        {isSearching && (
          <div className="fullScreen">
            {!searchTerm && <h3>اكتب واضغض على الايقونه للبحث</h3>}
            {!waite && <h3>منتج {products?.length}</h3>}
            {waite && <h3>... بحث</h3>}

            {products &&
              products.map((product) => (
                <Link
                  to={"/single/" + product._id}
                  className="card"
                  key={product._id}
                >
                  <h3>{product.name}</h3>
                </Link>
              ))}
          </div>
        )}
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          onClick={() => handleSearch()}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="... ابحث عن منتج"
          onClick={() => setIsSearching(true)}
        />
      </div>
      {!isSearching && (
        <Link to={"/"} className="theName">
          <p>توليب</p>
          <p>Tolibe</p>
        </Link>
      )}
      {isSearching && (
        <div className="theName">
          <span onClick={() => setIsSearching(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
