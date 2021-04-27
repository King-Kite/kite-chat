import React from "react"

const DropDownItem = (props) => {
  const obj = props.params.command !== 'block_contact' || props.blocked === false ?
    {className: props.className, text: props.text} :
    props.blocked === true &&
    {className: 'check_circle', text: 'Unblock Contact'}

  const handleClick = () => {
  	props.action(props.params);
  	return props.onClick();
  };

  return (
  	<button
      onClick={handleClick}
      className="dropdown-item"
    >
      <i className="material-icons">{obj.className}</i>
      {obj.text}
    </button>
  )
}

export default DropDownItem;