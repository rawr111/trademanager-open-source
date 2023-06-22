import react, { FC } from "react";

const ExtensionTab: FC = () => {
  return (
    <div className="main">
      <div className="list-container">
        <h1
          style={{
            top: "50%",
            left: "50%",
            position: "relative",
            transform: "translate(-50%, -50%)",
            lineHeight: "100%",
          }}
        >
          В разработке
        </h1>
      </div>
    </div>
  );
};

export default ExtensionTab;
