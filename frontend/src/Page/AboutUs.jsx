import Buttom from "../components/Buttom";
const AboutUs = () => {
  return (
    <>
      <div className="aboutus">
        <div>
          <h2>متجر توليب</h2>
          <div>
            <p>الموقع : تسيل </p>
          </div>
          <div>
            <p>اذا واجهتك اي مشكله يمكنك التواصل معي </p>
            <a
              href="https://wa.me/963936774524?text=مرحبا%20لدي%20مشكله"
              target="_blank"
              rel="noopener noreferrer"
            >
              تواصل مع صاحب المتجر
            </a>
          </div>
        </div>
        <br></br>
        <div>
          <h2>تم تطوير هذا الموقع من قبل المهندس حيدر القبلاوي </h2>
          <p>اذاكنت ترغب بالحصول على مثل هذا الموقع لعملك يمكنك التواصل معي </p>
          <a
            href="https://wa.me/963936774524"
            target="_blank"
            rel="noopener noreferrer"
          >
            تواصل مع المطور
          </a>
        </div>
      </div>
      <Buttom />
    </>
  );
};

export default AboutUs;
