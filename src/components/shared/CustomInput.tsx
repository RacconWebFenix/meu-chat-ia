import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

export type CustomInputProps = TextFieldProps & {
  label?: string;
  helperText?: string;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  helperText,
  ...props
}) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      label={label}
      helperText={helperText}
      {...props}
    />
  );
};

export default CustomInput;
