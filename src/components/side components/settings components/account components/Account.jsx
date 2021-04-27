import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/myInfo";
import { accountSettingsUrl, baseUrl, loadingDiv } from "../../../../constants";
import useDropDown from "../../../../hooks/useDropDown.jsx";
import useFormInput from "../../../../hooks/useFormInput.jsx";

const Account = (props) => {
  const userInfo = props.info.user_info !== undefined && props.info.user_info;
  const username = props.username;

  const [loading, setLoading] = useState(false);

  const image = useFormInput(userInfo.image_url);
  const firstName = useFormInput(userInfo.first_name);
  const lastName = useFormInput(userInfo.last_name);
  const email = useFormInput(userInfo.email);
  const location = useFormInput(userInfo.location);

  const dropDown = useDropDown("collapse", "title collapsed");

  const handleUpdate = (data) => {
    const newData = { ...props.info };
    const info = newData.user_info;
    info.email = data.email;
    info.first_name = data.first_name;
    info.last_name = data.last_name;
    info.full_name = data.first_name + " " + data.last_name;
    info.image_url = data.profile.image.replaceAll(baseUrl, "").trim();
    info.location = data.profile.location;

    return props.updateInfo(newData);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("first_name", firstName.value);
    form.append("last_name", lastName.value);
    form.append("email", email.value);
    form.append("profile.location", location.value);
    if (
      image.value !== null &&
      image.value !== undefined &&
      typeof image.value !== "string"
    ) {
      form.append("profile.image", image.value);
    }

    fetch(`${accountSettingsUrl}/${username}/`, {
      method: "put",
      headers: {
        Authorization: "Token " + props.token,
      },
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        handleUpdate(data);
        setLoading(false);
      })
      .catch((error) => props.updateFailed(error));
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
          <h5>My Account</h5>
          <p>Update your profile details</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseOne">
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="upload">
              <div className="data">
                <img
                  className="avatar-xl"
                  src={image.valueUrl !== null ? image.valueUrl : baseUrl + image.value}
                  alt="image"
                />
                <label>
                  <input
                    onChange={image.onChange}
                    name="image"
                    type="file"
                    required={false}
                  />
                  <span className="btn button">Upload avatar</span>
                </label>
              </div>
              <p>
                For best results, use an image at least 256px by 256px in either
                .jpg or .png format!
              </p>
            </div>
            <div className="parent">
              <div className="field">
                <label>
                  First name <span>*</span>
                </label>
                <input
                  onChange={firstName.onChange}
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={firstName.value}
                  required={true}
                />
              </div>
              <div className="field">
                <label>
                  Last name <span>*</span>
                </label>
                <input
                  onChange={lastName.onChange}
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={lastName.value}
                  required={true}
                />
              </div>
            </div>
            <div className="field">
              <label>
                Email <span>*</span>
              </label>
              <input
                onChange={email.onChange}
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={email.value}
                required={true}
              />
            </div>
            <div className="field">
              <label>Location</label>
              <input
                onChange={location.onChange}
                type="text"
                className="form-control"
                id="location"
                name="location"
                placeholder="Enter your location"
                value={location.value}
                required={true}
              />
            </div>
            {loading === true && loadingDiv}
            <button type="button" className="btn btn-link w-100">
              Delete Account
            </button>
            <button type="submit" className="btn button w-100">
              Apply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    info: state.info.myInfo,
    error: state.info.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateInfo: (info) => dispatch(actions.updateInfo(info)),
    updateFailed: (error) => dispatch(actions.updateFailed(error)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
