import {
  faDiamond,
  faExclamationCircle,
  faHome,
  faOutdent,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
const Buttom = () => {
  const { user, setUser } = useUser(); // ✅ تعديل: استخدام user object بدل username

  function logout() {
    setUser({ id: "", username: "" }); // ✅ تعديل: إعادة user object فارغ بدل setUsername("")
  }
  return (
    <div className="buttom">
      <Link to={"/about-us"}>
        <FontAwesomeIcon icon={faExclamationCircle} />
        <p>من نحن</p>
      </Link>
      <Link to={"/"}>
        <FontAwesomeIcon icon={faHome} />
        <p>الرئيسية</p>
      </Link>
      {!user.username && (
        <Link to={"/"}>
          <FontAwesomeIcon icon={faDiamond} />
          <p>soon..</p>
        </Link>
      )}
      {user.username && (
        <div onClick={() => logout()}>
          <FontAwesomeIcon icon={faSignOut} />
          <p>تسجيل خروج</p>
        </div>
      )}
    </div>
  );
};

export default Buttom;
