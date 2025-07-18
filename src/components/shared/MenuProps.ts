import { MenuProps } from "@mui/material";

/**
 * Props padrão para menus dropdown com boxShadow customizado
 */
export const customMenuProps: Partial<MenuProps> = {
  PaperProps: {
    style: {
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      borderRadius: "8px",
      border: "1px solid rgba(0,0,0,0.08)",
      marginTop: "4px",
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

/**
 * Props para menus dropdown maiores (como selects com muitas opções)
 */
export const largeMenuProps: Partial<MenuProps> = {
  ...customMenuProps,
  PaperProps: {
    style: {
      ...customMenuProps.PaperProps?.style,
      maxWidth: 400,
      maxHeight: 300,
    },
  },
};

/**
 * Props para menus dropdown menores (como filtros)
 */
export const smallMenuProps: Partial<MenuProps> = {
  ...customMenuProps,
  PaperProps: {
    style: {
      ...customMenuProps.PaperProps?.style,
      maxWidth: 250,
      maxHeight: 200,
    },
  },
};
