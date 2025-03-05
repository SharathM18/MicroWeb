import { Riple } from "react-loading-indicators";

const Loading = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Riple color="#000000" size="large" text="" textColor="#000000" />;
      </div>
    </>
  );
};

export default Loading;
