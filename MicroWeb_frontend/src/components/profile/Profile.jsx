import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import axiosInstance from "../../utils/axiosInstance";
import ProfileCard from "./ProfileCard";

import { setUser } from "../../store/userSlice";
import { logout } from "../../store/authSlice";
import Loading from "../../utils/Loading";

import "../../style/profile.css";

const Profile = () => {
  const [isCardVisible, setIsCardVisible] = useState(true);
  const userId = useSelector((state) => state.auth.userId);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // sends a request to fetch user data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userData", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is missing");
      const response = await axiosInstance.get(`/profile/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // sets the user data in the redux store
  useEffect(() => {
    if (data) dispatch(setUser(data.data));
  }, [data, dispatch]);

  // formats the date to a readable format
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  // checks if the current path is /profile and sets the card visibility
  useEffect(() => {
    setIsCardVisible(location.pathname === "/profile");
  }, [location.pathname]);

  const profileCard = [
    {
      title: "Your Account Details",
      description: "View name, email, mobile number, etc.",
      path: "/profile/account",
    },
    {
      title: "Your Address",
      description: "Manage address for orders",
      path: "/profile/address",
    },
    {
      title: "Your Orders",
      description: "Check your order details",
      path: "/orders",
    },
    {
      title: "Contact Us",
      description: "Reach our customer support",
      path: "profile/contactus",
    },
  ];

  return (
    <>
      <section className="profile_container">
        <h1 className="profile_title">Manage Your Profile</h1>
        {!isLoading && !isError && (
          <p className="profile_sub_heading">
            You joined on <strong>{formatDate(data?.data.createdAt)}</strong> &
            last updated your profile on{" "}
            <strong>{formatDate(data?.data.modifiedAt)}</strong>
          </p>
        )}

        {isLoading && <Loading />}

        {isError && (
          <h1 className="error_msg">
            <strong>Something went wrong...</strong>
          </h1>
        )}

        {!isLoading && !isError && isCardVisible && (
          <div className="profile_card_container">
            {profileCard.map((profile, idx) => (
              <Link to={profile.path} key={idx}>
                <ProfileCard
                  title={profile.title}
                  description={profile.description}
                />
              </Link>
            ))}
          </div>
        )}

        <Outlet />

        {/* Logout botton */}
        {isCardVisible && (
          <div className="logout_btn">
            <button
              className="btn"
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Profile;
