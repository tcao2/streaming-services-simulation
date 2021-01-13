import { useState } from "react";

const useInputState = (initialVal, noSpace = false) => {
  const [value, setValue] = useState(initialVal);
  const handleChange = (e) => {
    if (noSpace) {
      if (e.target.value.includes(" ")) {
        return;
      }
    }
    setValue(e.target.value);
  };
  const reset = () => {
    setValue("");
  };

  const setToValue = (someValue) => {
    setValue(someValue);
  };

  return [value, handleChange, reset, setToValue];
};

export default useInputState;
