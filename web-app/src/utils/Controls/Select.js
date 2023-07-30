import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";

export const selectPadding = { padding: "12px 4px" };

export default function Select(props) {
  const { name, label, value, error = null, onChange, options } = props;

  return (
    <FormControl variant="outlined" {...(error && { error: true })}>
      <InputLabel id={"select-label-1"}>{label}</InputLabel>
      <MuiSelect
        labelId={"select-label-1"}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        style={{textAlign: "start"}}
        // sx={selectPadding}
      >
        <MenuItem value="">None</MenuItem>
        {options.map((item) => (
          <MenuItem key={item.id ?? 0} value={item.id ?? ""}>
            {item.name ?? "Loading"}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}