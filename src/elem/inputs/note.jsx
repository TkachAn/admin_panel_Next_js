import React from "react";
import { Textarea } from "./Textarea";
import styles from "./Inputs.module.css"

export const TextareaNote = ({
  value,
  onChange,
  state = "normal",
  disabled = false,
}) => {
  return (
    <Textarea
      id="note"
      label="Примечание"
      value={value}
      onChange={onChange}
      placeholder="Напишите, если есть замечания или особенности..."
      rows={3}
      state={state}
      disabled={disabled}
      className={`${styles.input} }`}
    />
  );
};
//${styles[status]