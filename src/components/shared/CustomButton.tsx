import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 8,
  boxShadow: "none",
  transition: theme.transitions.create(
    ["background-color", "box-shadow", "border-color", "color"],
    {
      duration: theme.transitions.duration.short,
    }
  ),
  "&:active": {
    boxShadow: theme.shadows[2],
    filter: "brightness(0.97)",
  },
}));

export type CustomButtonProps = ButtonProps & {
  colorType?: "primary" | "secondary" | "cancel" | "delete";
};

const colorMap: Record<
  NonNullable<CustomButtonProps["colorType"]>,
  ButtonProps["color"]
> = {
  primary: "primary",
  secondary: "success",
  cancel: "inherit",
  delete: "error",
};

const CustomButton: React.FC<CustomButtonProps> = ({
  colorType = "primary",
  ...props
}) => {
  const color = colorMap[colorType] || "primary";
  return <StyledButton color={color} disableElevation {...props} />;
};

export default CustomButton;
