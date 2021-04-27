import React, { useState } from "react";

const usePopClass = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handlePopClass = () => {
  	return value === "modal fade" ?
  	  setValue("modal fade active show") :
  	    setValue("modal fade");
  }

  return {
    value,
	handlePopClass,
  }
}

export default usePopClass;