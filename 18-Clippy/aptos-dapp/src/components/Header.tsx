"use client";
import { WalletConnector as MuiWalletSelector } from "@aptos-labs/wallet-adapter-mui-design";
import { ThemeProvider, createTheme } from "@mui/material";
import Image from "next/image";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3730A3",
      dark: "#2d2682",
    },
    mode: "dark",
    background: {
      paper: "#141416",
      default: "#0A0A0B",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px !important",
          fontSize: "14px !important",
          padding: "8px 16px !important",
          backgroundColor: "#3730A3 !important",
          color: "#FFFFFF !important",
          "&:hover": {
            backgroundColor: "#2d2682 !important",
          },
        },
        outlined: {
          backgroundColor: "transparent",
          borderColor: "#3730A3",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(55, 48, 163, 0.1)",
            borderColor: "#2d2682",
          },
        },
        text: {
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#141416",
          borderRadius: "16px",
          color: "#FFFFFF",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          fontSize: "1.25rem",
          fontWeight: 500,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
  },
});

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-md mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6">
              <Image src="/images/logo.png" alt="logo" width={32} height={32} />
            </div>
            <span className="text-white font-medium">LIFE++</span>
          </a>
          <ThemeProvider theme={theme}>
            <MuiWalletSelector />
          </ThemeProvider>
        </div>
      </div>
    </header>
  );
}
