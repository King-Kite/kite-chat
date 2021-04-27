import React, { useState } from "react";

const useRefreshIcon = (action) => {
  const [className, setClassName] = useState("btn refresh-button");

  const handleClick = (decision) => {
    return decision === true
      ? setClassName("btn refresh-button refresh-loading")
      : setClassName("btn refresh-button");
  };

  const performAction = () => {
    handleClick(true);
    action();
  };

  const button = (
    <div className="refresh">
      <button onClick={performAction} className={className}>
        <i className="material-icons">{"refresh"}</i>
      </button>
    </div>
  );

  return {
    className,
    handleClick,
    button,
  };
};

export default useRefreshIcon;
