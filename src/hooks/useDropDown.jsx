import React, { useState } from "react";

const useDropDown = (initialDiv, initialA) => {
  const [divValue, setDivValue] = useState(initialDiv);
  const [aValue, setAValue] = useState(initialA);

  const handleClick = () => {
    return divValue === "collapse"
      ? (setDivValue("collapse show"), setAValue("title"))
      : (setDivValue("collapse"), setAValue("title collapsed"));
  };

  return {
    divValue: divValue,
    aValue: aValue,
    handleClick: handleClick,
  };
};

export default useDropDown;
