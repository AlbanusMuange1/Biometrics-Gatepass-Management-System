import React from "react";
import { TextField } from "@mui/material";

export default function Input(props) {
  const { name, label, value, error = null, onChange, ...rest } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      {...rest}
    />
  );
}