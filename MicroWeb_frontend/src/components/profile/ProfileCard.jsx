import "../../style/profileCard.css";

const ProfileCard = (props) => {
  const { title, description } = props;
  return (
    <>
      <section className="profile_card">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </>
  );
};

export default ProfileCard;
