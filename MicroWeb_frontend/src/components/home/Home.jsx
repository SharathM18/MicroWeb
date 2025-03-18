import HeroSection from "./HeroSection.jsx";
import HeroSectionReverse from "./HeroSectionReverse.jsx";

import iphone14pro1 from "../../assets/images/iphone14pro1.jpg";
import thinkpad from "../../assets/images/thinkpad-x1-carbon-4.jpg";
import LeftHorizontalScroll from "./LeftHorizontalScroll.jsx";
// import RightHorizontalScroll from "./RightHorizontalScroll.jsx";

import "../../style/home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <HeroSection
        title="iPhone 14 Pro"
        subtitle="The iPhone 14 Pro features a 6.1-inch Super Retina XDR display, A16 Bionic chip, Dynamic Island for interactive notifications, a 48MP main camera with advanced low-light performance"
        link="/products"
        image={iphone14pro1}
      />
      <div className="brand_logo">
        <h1>Brands You Trust, Products You Love</h1>
      </div>
      <LeftHorizontalScroll />
      <section className="second_box">
        <HeroSectionReverse
          title="Lenovo ThinkPad X1"
          subtitle="The Lenovo ThinkPad X1 is a business laptop with a 14-inch FHD+ display, 16GB of RAM, 512GB of storage, and a 11th Gen Intel Core i7 processor. It also features a backlit keyboard, and runs on Windows 10 Pro."
          link="/products"
          image={thinkpad}
        />
      </section>
      {/* <RightHorizontalScroll /> */}

      <div className="footer">
        <div className="copyrights">
          © 2025-2026, zencart.com, Inc. or its affiliates
        </div>
        <div className="footer_links">
          <Link to="/login">Login</Link>
          <Link to="/products">Products</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
