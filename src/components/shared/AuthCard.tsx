import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

interface AuthCardProps {
  title?: string;
  children: React.ReactNode;
  logo?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, children, logo, sx }) => (
  <Card
    sx={{
      maxWidth: 400,
      width: "100%",
      mx: "auto",
      my: 6,
      borderRadius: 3,
      boxShadow: 3,
      ...sx,
    }}
  >
    {logo && (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        {logo}
      </Box>
    )}
    {title && (
      <CardHeader
        title={title}
        sx={{
          textAlign: "center",
          pb: 0,
          "& .MuiCardHeader-title": {
            color: (theme) => theme.palette.primary.main,
            fontWeight: 600,
            fontSize: 24,
          },
        }}
      />
    )}
    <CardContent sx={{ pt: 2 }}>{children}</CardContent>
  </Card>
);

export default AuthCard;
