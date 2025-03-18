import "../../style/horizontalScroll.css";

import oneplus_logo from "../../assets/images/oneplus.png";
import apple_logo from "../../assets/images/apple.png";
import google_logo from "../../assets/images/google.png";
import hp_logo from "../../assets/images/hp.png";
import microsoft_logo from "../../assets/images/microsoft.png";
import samsung_logo from "../../assets/images/samsung.png";

function LeftHorizontalScroll() {
  return (
    <div>
      <div className="wrapper">
        <div className="itemLeft item1">
          <img src={oneplus_logo} alt="oneplus" />
        </div>
        <div className="itemLeft item2">
          <img src={apple_logo} alt="apple" />
        </div>
        <div className="itemLeft item3">
          <img src={google_logo} alt="google" />
        </div>
        <div className="itemLeft item4">
          <img src={hp_logo} alt="hp" />
        </div>
        <div className="itemLeft item5">
          <img src={microsoft_logo} alt="microsoft" />
        </div>
        <div className="itemLeft item6">
          <img src={samsung_logo} alt="samsung" />
        </div>
        <div className="itemLeft item7">
          <img src={apple_logo} alt="apple" />
        </div>
        <div className="itemLeft item8">
          <img src={hp_logo} alt="hp" />
        </div>
      </div>
    </div>
  );
}

export default LeftHorizontalScroll;
