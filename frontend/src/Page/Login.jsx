import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user, setUser } = useUser();
  const [Error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function Login(e) {
    e.preventDefault();
    axios
      .post("/api/user/login", { name, password })
      .then((res) => {
        setUser({
          id: res.data._id, // تأكد أن الbackend يرسل _id
          username: res.data.name, // الاسم
        });

        navigate("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  return (
    <div className="login" onSubmit={(e) => Login(e)}>
      <form>
        <input
          type="text"
          placeholder="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="more-btn">Login</button>
        {Error && <p className="error">{Error}</p>}
        <p>
          نسيت كلمه السر
          <a
            href="https://wa.me/963936774524?text=مرحبا%20نسيت%20كلمه%20السر"
            target="_blank"
            rel="noopener noreferrer"
          >
            تواصل معي على واتساب
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
