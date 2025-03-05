import HeroSection from "./HeroSection.jsx";

import iphone14pro from "../../assets/images/iphone14pro.png";

const Home = () => {
  return (
    <>
      <HeroSection
        title="iPhone 14 Pro"
        subtitle="The iPhone 14 Pro features a 6.1-inch Super Retina XDR display, A16 Bionic chip, Dynamic Island for interactive notifications, a 48MP main camera with advanced low-light performance"
        link="/"
        image={iphone14pro}
      />
    </>
  );
};

export default Home;
