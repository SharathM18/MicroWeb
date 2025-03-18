import "../style/pageNotFound.css";

import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <section className="page_found_container">
        <h1>404!</h1>
        <h2>Looks like you took a wrong turn.</h2>
        <div className="page_found_btn">
          <Link to="/" className="btn">
            Home
          </Link>
          <Link to="/login" className="btn">
            Login
          </Link>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;
