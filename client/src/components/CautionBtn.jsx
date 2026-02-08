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
            <div className="tooltip-icon">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="info-icon"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>

            <div>
              <h3>Restricted Access
                <i className="fa-solid fa-exclamation text-red-600"></i>
                <i className="fa-solid fa-exclamation text-red-600"></i>
                <i className="fa-solid fa-exclamation text-red-600"></i>
              </h3>
              <p>Reserved for authorized staff members only.</p>
            </div>
          </div>

          <div className="features">
            <FeatureItem text="Admins" />
            <FeatureItem text="Employees" />
            <FeatureItem text="Internal Staff Members" />
          </div>

          <div className="tooltip-footer">
            <span>Please Return to the main website to <br /> continue browsing or booking our services</span>
            <a href="#">Homepage →</a>
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