import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { toggleUserRole } from "../store/userRoleSlice";

import "../style/navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userCurrentRole = useSelector(
    (state) => state.userRole.userCurrentRole
  );

  const cartCount = useSelector((state) => state.cartCount.cartCount);

  const navbarItem = [
    {
      name: "Home",
      path: "/",
      authStatus: true,
      role: true,
    },
    {
      name: "Products",
      path: "/products",
      authStatus: true,
      role: "buyer" === userCurrentRole || !isAuthenticated,
    },
    {
      name: "Login",
      path: "/login",
      authStatus: !isAuthenticated,
      role: !isAuthenticated,
    },
    {
      name: "Signup",
      path: "/signup",
      authStatus: !isAuthenticated,
      role: !isAuthenticated,
    },
    {
      name: "My Products",
      path: "/myproducts",
      authStatus: isAuthenticated,
      role: "seller" === userCurrentRole,
    },
    {
      name: "Add Product",
      path: "/product/addproducts",
      authStatus: isAuthenticated,
      role: "seller" === userCurrentRole,
    },
    {
      name: "Cart",
      path: "/cart",
      authStatus: isAuthenticated,
      role: "buyer" === userCurrentRole,
    },
    {
      name: "Orders",
      path: "/orders",
      authStatus: isAuthenticated,
      role: "buyer" === userCurrentRole,
    },
    {
      name: "Profile",
      path: "/profile",
      authStatus: isAuthenticated,
      role: true,
    },
  ];

  return (
    <header className="navbar">
      <div className="zencart_title">
        <Link to="/">
          <h1 className="navbar_heading">ZenCart</h1>
        </Link>
        <p>
          {isAuthenticated
            ? userCurrentRole === "buyer"
              ? "Buyer"
              : "Seller"
            : null}
        </p>
      </div>

      <div className="user_role_switch">
        {isAuthenticated && (
          <Link to="/">
            <button className="btn" onClick={() => dispatch(toggleUserRole())}>
              Switch to {userCurrentRole === "buyer" ? "Seller" : "Buyer"}
            </button>
          </Link>
        )}
      </div>

      <nav className="navbar_links">
        {navbarItem.map((item, idx) =>
          item.authStatus && item.role && item.name != "Cart" ? (
            <NavLink to={item.path} key={idx}>
              {item.name}
            </NavLink>
          ) : item.authStatus && item.role && item.name === "Cart" ? (
            <NavLink to={item.path} key={idx} className="navbar_cart">
              {item.name} <span className="cart_count">{cartCount}</span>
            </NavLink>
          ) : null
        )}
      </nav>
    </header>
  );
};

export default Navbar;
