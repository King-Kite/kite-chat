import React from "react";

const Logout = () => {
  return (
    <div className="category">
      <a href="sign-in.html" className="title collapsed">
        <i className="material-icons md-30 online">power_settings_new</i>
        <div className="data">
          <h5>Power Off</h5>
          <p>Log out of your account</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
    </div>
  );
};

export default Logout;
