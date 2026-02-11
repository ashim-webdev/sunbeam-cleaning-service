import React from "react";
import "./components.css";

const CautionBtn = () => {
  return (
    <div className="caution-wrapper">
      <button className="caution-btn">
        <div className="btn-glow" />

        <span className="btn-content">
          {/* Caution Icon Spin {seperate component} */}
          <div class="tooltip-container hint" data-position="4">
            <div class="icon hint-dot">
              <span class="hint-radius"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.518 0-10-4.482-10-10s4.482-10 10-10 10 4.482 10 10-4.482 10-10 10zm-1-16h2v6h-2zm0 8h2v2h-2z"
                ></path>
              </svg>
            </div>
          </div>
        </span>
      </button>

      {/* Tooltip */}
      <div className="tooltip">
        <div className="tooltip-box">
          <div className="tooltip-glow" />

          <div className="tooltip-header">
            <div className="tooltip-icon animate-pulse">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="info-icon animate-vibrate"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>

            <div>
              <h3 className="">Restricted Access
                <i className="fa-solid fa-exclamation text-red-600 animate-ping"></i>
                <i className="fa-solid fa-exclamation text-red-600 animate-ping"></i>
                <i className="fa-solid fa-exclamation text-red-600 animate-ping"></i>
              </h3>
              <p className="">Reserved for authorized staff members only.</p>
            </div>
          </div>

          <div className="features">
            <FeatureItem text="Admins" />
            <FeatureItem text="Employees" />
            <FeatureItem text="Internal Staff Members" />
          </div>

          <div className="tooltip-footer">
            <span>Please Return to the main website to <br /> continue browsing or booking our services</span>
            <a className="mr-2" href="#">
              <button className="GoToBtn ClickAnimationNoti shadow-inner hover:shadow-innerGRN">
                <svg height="1.2em" className="arrow text-2xl font-bold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"/></svg>
                <p className="text">Back to Home</p>
              </button>
            </a>
          </div>

          <div className="tooltip-arrow" />
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <div className="feature-item">
    <div className="feature-icon">
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        className="check-icon"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        />
      </svg>
    </div>
    <span>{text}</span>
  </div>
);

export default CautionBtn;