import { useSelector } from "react-redux";

import "../../style/profileAccountCard.css";

const ProfileAccountCard = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <>
      <section className="account_container">
        <table className="account_table">
          <tbody>
            <tr>
              <td>Account Id</td>
              <td>{user?._id}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{user?.fullName}</td>
            </tr>
            <tr>
              <td>Email Address</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>Phone Number</td>
              <td>{user?.mobileNumber || "Update Now"}</td>
            </tr>
            <tr>
              <td>Account access to</td>
              <td>
                {user?.role
                  .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
                  .join(", ")}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
};

export default ProfileAccountCard;
