import React from "react";

const FormItem = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const button = props.handlePopClass && 
    props.handlePopClass !== undefined && (
      <button onClick={props.handlePopClass} className="btn create">
        <i className="material-icons">create</i>
      </button>
  );

  const className = props.className &&
    props.className !== undefined ?
      `material-icons ${props.className}` : "material-icons";

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="form-inline position-relative">
        <input
          onChange={props.handleChange}
          type="search"
          className="form-control"
          name="search"
          placeholder={props.placeholder}
          value={props.search}
        />
        <button type="button" className="btn btn-link loop">
          <i className={className}>{props.iconText}</i>
        </button>
        {button !== undefined && button}
      </form>
    </React.Fragment>
  );
}

export default FormItem;