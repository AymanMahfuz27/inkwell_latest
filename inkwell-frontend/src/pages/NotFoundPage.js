import React from "react";
import "../css/NotFoundPage.css";
import WatercolorBackgroundError from "../components/WatercolorBackgroundError";

const NotFoundPage = () => {
  return (
    <>
      <WatercolorBackgroundError />
      <div className="not-found-container">
        <div className="not-found-card">
          <h1>404: Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
