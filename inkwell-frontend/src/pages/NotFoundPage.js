import React from "react";
import "../css/NotFoundPage.css";
import WatercolorBackgroundError from "../components/WatercolorBackgroundError";

const NotFoundPage = () => {
  return (
    <>
      <WatercolorBackgroundError />
      <div className="not-found-container">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </>
  );
};

export default NotFoundPage;
