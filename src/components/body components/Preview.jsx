import React from "react";

const Preview = (props) => {
  const type =
    props.type === "V"
      ? "Video"
      : props.type === "I"
      ? "Image"
      : props.type === "A"
      ? "Audio"
      : "Document";
  const size = parseInt(props.size) / 1000;
  const { image, name } = props;
  const display = image ? (
    <img className="avatar-md" src={image} alt="file" />
  ) : (
    <i className="text-primary material-icons">insert_drive_file</i>
  );

  return (
    <div
      className="d-flex justify-content-between w-50"
      style={{ background: "#f5f5f5" }}
    >
      <div className="w-25 d-flex justify-content-center align-items-center">
        {display}
      </div>
      <div className="w-75">
        <p style={{ color: "#2195f3", float: "left" }}>
          {name.slice(0, 22) + "..."}
        </p>
        <button
          onClick={props.handleClose}
          className="btn"
          style={{ float: "right", fontSize: "20px" }}
        >
          <i className="text-primary material-icons mr-1">close</i>
        </button>
        <span style={{ float: "left" }}>
          {size}KB {type}
        </span>
      </div>
    </div>
  );
};

export default Preview;
