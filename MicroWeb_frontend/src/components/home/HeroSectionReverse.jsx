import { Link } from "react-router-dom";

import "../../style/heroSection.css";

const HeroSectionReverse = (props) => {
  const { title, subtitle, link, image } = props;
  return (
    <>
      <section className="hero_section">
        <div className="hero_image">
          <img src={image} alt={title} />
        </div>
        <div className="hero_content">
          <h2 className="hero_title">{title}</h2>
          <p className="hero_subtitle">{subtitle}</p>

          <Link to="/products" className="hero_link">
            Explore
          </Link>
        </div>
      </section>
    </>
  );
};

export default HeroSectionReverse;
