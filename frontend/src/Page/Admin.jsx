import axios from "axios";
import { useEffect, useState } from "react";

const Admin = () => {
  const [isnewUser, setIsNewUser] = useState(true);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    axios
      .get("/api/admen/findUser")
      .then((res) => {
        setUsers(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  function newUser() {
    axios
      .post("/api/admen/newUser", { name, password })
      .then((res) => {
        setUsers([...users, ...res.data]);
        setName("");
        setPassword("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }

  function EditUser() {
    axios
      .post("/api/admen/updateUser", { name, password })
      .then((res) => {
        setName("");
        setPassword("");
        isnewUser(true);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }
  return (
    <div className="admin-page">
      <div className="users">
        <div className="add-user">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              isnewUser ? newUser() : EditUser();
            }}
          >
            {isnewUser ? "Add User" : "Edit User"}
          </button>
        </div>
        <br />
        {users.length === 0 && <h2>No Users</h2>}
        {users.length > 0 &&
          users.map((user) => (
            <div className="user" key={user._id}>
              <div>
                <h2>{user.name}</h2>
              </div>
              <button
                onClick={() => {
                  setName(user.name);
                  setIsNewUser(false);
                }}
              >
                Edit
              </button>
              <br />
              <button>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admin;
