import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { useUser } from "../context/UserContext";

import imageCompression from "browser-image-compression";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const { user } = useUser();

  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [images, setImages] = useState([]); // ملفات الصور قبل الرفع

  useEffect(() => {
    axios.get("api/user/getallsections").then((res) => {
      setSections(res.data);
    }, []);
  }, []);

  // 2. تعديل اختيار المستخدم
  const handleCategoryChange = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // اختيار الصور
  const handleImgChange = async (e) => {
    const files = Array.from(e.target.files);

    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        // إذا الحجم أكبر من 1MB نضغطه
        if (file.size > 1024 * 1024) {
          try {
            const options = {
              maxSizeMB: 1, // الحجم الأقصى للصورة بعد الضغط
              maxWidthOrHeight: 1200, // أقصى طول/عرض
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
          } catch (err) {
            console.error("خطأ بالضغط:", err);
            return file;
          }
        }
        return file;
      })
    );

    setImages((prev) => [...prev, ...compressedFiles]);
  };

  // حذف صورة من state
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || images.length === 0) {
      alert("الرجاء تعبئة الحقول المطلوبة");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    selectedSections.forEach((id) => formData.append("categories", id));
    images.forEach((img) => formData.append("images", img));

    try {
      setUploadProgress(0); // 🔥 تصفير التقدم قبل البدء
      setIsProcessing(false);

      const res = await axios.post("/api/user/createproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
          if (percent === 100) {
            setIsProcessing(true); // ✅ خلّيها تفوت على حالة "جاري المعالجة..."
          }
        },
      });
      alert("تم إنشاء المنتج بنجاح ✅");
      setUploadProgress(0);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إنشاء المنتج ❌");
      setUploadProgress(0);
      setIsProcessing(false);
    }
  };

  return (
    <div className="add-product">
      <form onSubmit={handleCreateProduct}>
        <div>
          <label htmlFor="">اسم المنتج</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">الوصف</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">السعر</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">هل يوجد تخفيض على السعر</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <div>
          <label>: اختر الأصناف التي نتمي لها المنج</label>
          {sections.map((section) => (
            <label className="section-select" key={section._id}>
              <input
                type="checkbox"
                checked={selectedSections.includes(section._id)}
                onChange={() => handleCategoryChange(section._id)}
              />
              {section.name}
            </label>
          ))}
        </div>

        <div className="image">
          <h2> : اضافه صور للمنتج </h2>
          <div className="add">
            <label htmlFor="img">
              <FontAwesomeIcon icon={faPlus} />
            </label>
            <input type="file" id="img" multiple onChange={handleImgChange} />
            {/* معاينة الصور */}
            {images.map((img, index) => (
              <div className="img" key={index}>
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  width="100"
                  height="100"
                />
                <button type="button" onClick={() => handleRemoveImage(index)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          className="more-btn"
          disabled={
            (uploadProgress > 0 && uploadProgress < 100) || isProcessing
          }
        >
          {uploadProgress > 0 && uploadProgress < 100
            ? `جاري الرفع ${uploadProgress}%`
            : isProcessing
            ? "جاري المعالجة..."
            : "إنشاء"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
