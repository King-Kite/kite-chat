import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/myInfo";
import { accountChangePasswordUrl, loadingDiv } from "../../../../constants";
import useDropDown from "../../../../hooks/useDropDown.jsx";
import useFormInput from "../../../../hooks/useFormInput.jsx";

const Password = (props) => {
  const { username, token } = props;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('d-none');
  const [message, setMessage] = useState("");

  const password1 = useFormInput("");
  const password2 = useFormInput("");

  const dropDown = useDropDown("collapse", "title collapsed");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("new_password1", password1.value);
    form.append("new_password2", password2.value);
    
    fetch(accountChangePasswordUrl, {
      method: "post",
      headers: {
        Authorization: "Token " + token,
      },
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.detail) {
          setSuccess('d-flex');
          setMessage(data.detail);
          password1.onSubmit("");
          password2.onSubmit("");
        } else if (data.new_password2) {
          setMessage(data.new_password2)
          setSuccess('d-flex');
        }
      })
      .catch((error) => error);
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingOne"
      >
        <i className="material-icons md-30 online">person_outline</i>
        <div className="data">
          <h5>Change Password</h5>
          <p>Change your Account Password</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseOne">
        <div className={`${success} justify-content-center`}>
          <span
            className="p-2 text-success bg-dark"
          >
            { message }
          </span>
        </div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>
                New Password <span>*</span>
              </label>
              <input
                onChange={password1.onChange}
                type="password"
                className="form-control"
                id="password1"
                name="password1"
                placeholder="New Password"
                value={password1.value}
                required={true}
              />
            </div>
            <div className="field">
              <label>
                Confirm New Password <span>*</span>
              </label>
              <input
                onChange={password2.onChange}
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                placeholder="Confirm New Password"
                value={password2.value}
                required={true}
              />
            </div>
            {loading === true && loadingDiv}
            <button type="button" className="btn btn-link w-100">
              Reset Password
            </button>
            <button type="submit" className="btn button w-100">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(Password);
