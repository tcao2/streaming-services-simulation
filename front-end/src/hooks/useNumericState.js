import { useState } from "react";

const useNumericState = (initVal) => {
  const [value, setValue] = useState(initVal);
  const handleChange = (e) => {
    const regex = /^[0-9]+([.][0-9]+)?$/g;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  const reset = () => {
    setValue("");
  };

  const setToValue = (someValue) => {
      setValue(someValue);
  }

  return [value, handleChange, reset, setToValue];
};

export default useNumericState;
