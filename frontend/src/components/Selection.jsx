import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Selection = () => {
  const { user } = useUser();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get("api/user/getallsections").then((res) => {
      setSections(res.data);
    }, []);
  }, []);

  function openDelete(id, name) {
    const confirmDelete = window.confirm(
      `  هل أنت متأكد أنك تريد حذف الصنف المسمى " ${name} " `
    );

    if (confirmDelete) {
      axios
        .post("/api/user/deletesection", {
          id,
        })
        .then((response) => {
          setSections((prev) => prev.filter((section) => section._id !== id));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <div className="selection">
      {user.username && (
        <Link to={"/user/add-section"} className="add-section">
          <div>+</div>
          <h4>اضافه قسم</h4>
        </Link>
      )}
      {sections &&
        sections.map((section) => (
          <div key={section._id}>
            {user.username && (
              <>
                <div
                  className="for-user"
                  onClick={() => openDelete(section._id, section.name)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </div>
                <Link
                  className="for-user"
                  to={"user/edit-section"}
                  state={{
                    id: section._id,
                    name: section.name,
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </Link>
              </>
            )}
            <Link to={"/section/" + section._id}>
              <img src={section.img.secure_url} />
              <h4>{section.name}</h4>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Selection;
