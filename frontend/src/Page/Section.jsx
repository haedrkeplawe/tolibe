import { Link, useParams } from "react-router-dom";
import Boxs from "../components/Boxs";
import Search from "../components/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const Section = () => {
  const { id } = useParams();
  const [products, setProducts] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get("/api/user/getproductsbysection/" + id)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="section">
      <Search />
      <h3>
        {products?.length > 0 &&
          products[0].categories.map((categorie) => {
            if (categorie._id === id) {
              return categorie.name;
            }
          })}
      </h3>

      {products?.length > 0 && (
        <div className="boxs">
          <div>
            <div className="header">
              <Link to={"/section"}>
                <FontAwesomeIcon icon={faAngleLeft} /> عرض الكل{" "}
              </Link>
              {/* <h3>{section.name}</h3> */}
            </div>
            <div className="cards">
              {products.map((product) => (
                <Link
                  to={"/single/" + product._id}
                  className="card"
                  key={product._id}
                >
                  {product.discount > 0 && (
                    <span className="discount">وفر {product.discount}</span>
                  )}
                  <img src={product.images[0].secure_url} />
                  <h4>{product.name}</h4>
                  <div className="price">
                    {product.discount > 0 && (
                      <span>{product.price - product.discount} ل.س</span>
                    )}
                    <span className={product.discount > 0 && "old"}>
                      {product.price} ل.س
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {products && !products?.length > 0 && (
        <h3 style={{ textAlign: "center" }}>لا يوجد منتجات في هذا القسم</h3>
      )}
      {/* TODO fix more */}
      {/* <button className="more-btn">عرض المزيد</button> */}
    </div>
  );
};

export default Section;
