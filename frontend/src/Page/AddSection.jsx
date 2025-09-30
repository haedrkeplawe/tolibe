import { useRef, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

const AddSection = () => {
  const coverImgRef = useRef(null);
  const [name, setName] = useState("");
  const [img, setImg] = useState(null);
  const [Error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!img || !name.trim()) {
      setError("لازم تدخل نص وصورة");
      return;
    }
    //  prossess img
    let imageCompress = img;
    if (imageCompress.size > 1024 * 1024) {
      try {
        const options = {
          maxSizeMB: 1, // الحجم الأقصى للصورة بعد الضغط
          maxWidthOrHeight: 1200, // أقصى طول/عرض
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(img, options);
        imageCompress = compressedFile;
      } catch (err) {
        console.error("خطأ بالضغط:", err);
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageCompress); // file جاي من input type="file"
    reader.onloadend = async () => {
      const base64Image = reader.result; // data:image/png;base64,...

      await axios
        .post("/api/user/createsection", {
          name,
          userId: user.id,
          img: base64Image, // string
        })
        .then((res) => {
          alert("تم الرفع بنجاح");
          navigate("/");
        })
        .catch((err) => {
          setError(err.response.data.error);
        });
    };
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
    }
  };
  return (
    <div className="add-section-page">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="أدخل نص"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <input
            type="file"
            name="img"
            ref={coverImgRef}
            onChange={handleImgChange}
          />
        </div>
        <button className="more-btn">انشاء الصنف</button>
        {Error && <p className="error">{Error}</p>}
      </form>
    </div>
  );
};

export default AddSection;
