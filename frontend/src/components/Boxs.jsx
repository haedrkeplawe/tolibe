import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Boxs = () => {
  const { user } = useUser();
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/user/getallsections")
      .then((res) => {
        setSections([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/api/user/getallproducts")
      .then((res) => {
        setProducts([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="boxs">
        {user.username && (
          <Link to={"/user/add-product"} className="add-product">
            اصافه منتج جديد
          </Link>
        )}

        {sections &&
          sections.map((section) => {
            const productsInSection = products.filter((product) =>
              product.categories.includes(section._id)
            );

            if (productsInSection.length === 0) return null;

            return (
              <div key={section._id}>
                <div className="header">
                  <Link to={"/section/" + section._id}>
                    <FontAwesomeIcon icon={faAngleLeft} /> عرض الكل{" "}
                  </Link>
                  <h3>{section.name}</h3>
                </div>
                <div className="cards">
                  {productsInSection.map((product) => (
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
                        <span className={product.discount > 0 ? "old" : ""}>
                          {product.price} ل.س
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Boxs;
