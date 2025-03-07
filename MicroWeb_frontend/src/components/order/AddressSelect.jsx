import "../../style/addressSelect.css";

const AddressSelect = ({ address, isSelected, onSelect }) => {
  const {
    _id,
    fullName,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    pincode,
    country,
    phoneNumber,
  } = address;

  return (
    <>
      <section
        className={`address_select_box ${isSelected ? "selected" : ""}`}
        onClick={onSelect}
      >
        <h1>{fullName}</h1>
        <p>{addressLineOne}</p>
        <p>{addressLineTwo}</p>
        <p>
          <span>{city}</span>, <span>{state}</span> - <span>{pincode}</span>
        </p>
        <p>{country}</p>
        <p>Phone Number: {phoneNumber}</p>
      </section>
    </>
  );
};

export default AddressSelect;
