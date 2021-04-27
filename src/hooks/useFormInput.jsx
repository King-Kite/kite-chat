import React, { useState } from "react";

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [valueUrl, setValueUrl] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [size, setSize] = useState(null);

  const handleFile = (file) => {
    if (file && file !== undefined) {
      let fileUrl = value;
      if (file["type"].search("image") >= 0) {
        if (typeof file === "string") {
          fileUrl = file;
        } else {
          fileUrl = URL.createObjectURL(file);
        }
        setType("I");
      } else if (file["type"].search("audio") >= 0) {
        setType("A");
      } else if (file["type"].search("video") >= 0) {
        setType("V");
      } else {
        setType("D");
      }
      return (
        setValueUrl(fileUrl),
        setValue(file),
        setName(file["name"]),
        setSize(file["size"])
      );
    }
  };

  const handleEmoji = (emojiObject) => {
    console.log(emojiObject)
    return setValue(value + emojiObject.emoji)
  }

  const handleChange = (event) => {
    return event.target.type === "checkbox"
      ? setValue(!value)
      : event.target.type === "file"
      ? handleFile(event.target.files[0])
      : setValue(event.target.value);
  };

  const handleSubmit = (val) => {
    return (
      setValue(val),
      setValueUrl(null),
      setType(null),
      setName(null),
      setSize(null)
    );
  };

  return {
    name,
    size,
    type,
    value,
    valueUrl,
    handleEmoji,
    onChange: handleChange,
    onSubmit: handleSubmit,
  };
};

export default useFormInput;
