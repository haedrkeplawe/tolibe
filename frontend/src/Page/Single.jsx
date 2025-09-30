import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boxs from "../components/Boxs";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
const Single = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [currentImg, setCurrentImg] = useState();
  const { user } = useUser();
  const currentUrl = window.location.href;

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/user/getsingleproduct/" + id)
      .then((response) => {
        setProduct(response.data);
        setCurrentImg(0);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function openDelete(id, name) {
    const confirmDelete = window.confirm(
      `  هل أنت متأكد أنك تريد حذف الصنف المسمى " ${name} " `
    );

    if (confirmDelete) {
      axios
        .post("/api/user/deleteproduct", {
          id,
        })
        .then((response) => {
          alert("تم حذف المنتج بنجاح ✅");
          navigate("/"); // 🔥 بعد الحذف يوديك للصفحة الرئيسية
        })
        .catch((error) => {
          console.log(error);
          alert("حدث خطأ أثناء حذف المنتج ❌");
        });
    }
  }

  return (
    <div className="single">
      <h3>
        <p>تفاصيل المنتج</p>
        <Link to={"/"}>
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </h3>
      {product && (
        <>
          <div className="images">
            <div className="image">
              <img src={product.images[currentImg].secure_url} alt="" />
            </div>
            <div className="slider">
              {product.images.map((img, index) => (
                <img
                  className={currentImg == index ? "currentimg" : ""}
                  key={index}
                  src={img.secure_url}
                  alt=""
                  onClick={() => setCurrentImg(index)}
                />
              ))}
            </div>
          </div>
          <h2>{product.name}</h2>
          <span></span>
          <h2> : الوصف </h2>
          <p>{product.description === "" && "لا يوجد وصف"}</p>
          <p>{product.description}</p>

          {/* <Boxs /> */}
          <div className="footer">
            <div className="price">
              <p>: السعر</p>
              <span>{product.price} ل.س</span>
            </div>
            <a
              href={`https://wa.me/963936774524?text=${encodeURIComponent(
                `مرحبا اريد طلب هذا المنتج ${currentUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="conection"
            >
              اشتري الان
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
            {user.username && (
              <div className="updateordelete">
                <Link
                  to={"/user/edit-product/" + [product._id]}
                  className="update"
                >
                  تعديل المنتج
                </Link>
                <button
                  className="delete"
                  onClick={() => openDelete(product._id, product.name)}
                >
                  حذف المنتج
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Single;
