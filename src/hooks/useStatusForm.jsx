import React, { useEffect, useState } from "react";

const useStatusForm = (initialList, query, search) => {
  const verified = initialList !== undefined && initialList;
  const [list, setList] = useState(verified);
  const [status, setStatus] = useState(verified);
  const [listStatus, setListStatus] = useState(verified);
  const [showStatus, setShowStatus] = useState("first");

  useEffect(() => {
  	setList(verified);
	  setStatus(verified);
	  setListStatus(verified);
  }, [initialList])

  const second = list && list !== undefined && list.filter((item) => {
  	const value = item[query[0]] !== undefined && query[1] !== undefined ? 
  	  item[query[0]][query[1]] : item[query[0]];
    return value !== undefined && value == true && item;
  });

  const third = list && list !== undefined && list.filter((item) => {
  	const value = item[query[0]] !== undefined && query[1] !== undefined ? 
  	  item[query[0]][query[1]] : item[query[0]];
    return value !== undefined && value == false && item;
  });

  const handleStatus = (name) => {
    setShowStatus(name);
    const value =
      name === "second" ? second : name === "third" ? third : list;
    setStatus(value);
    setListStatus(value);
  };

  const handleSearch = (value) => {
	const values = listStatus.filter((obj) => {
	  const searchValue = search[1] !== undefined ? 
	  	obj[search[0]][search[1]] : obj[search[0]]
	  return searchValue.toLowerCase().indexOf(value.toLowerCase()) > -1 && obj;
	});
	return setStatus(values);
  };

  return {
  	list,
  	status,
  	showStatus,
  	handleSearch,
  	handleStatus,
  }
}

export default useStatusForm;
