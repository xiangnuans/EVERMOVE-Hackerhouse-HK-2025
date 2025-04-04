"use client";

import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { ThemeProvider, createTheme } from "@mui/material";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3730A3 !important",
    },
    mode: "dark",
    background: {
      paper: "#141416",
      default: "#0A0A0B",
    },
    text: {
      primary: "#FFFFFF !important",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px !important",
          backgroundColor: "#3730A3 !important",
          color: "#FFFFFF !important",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#141416 !important",
          borderRadius: "16px !important",
          color: "#FFFFFF !important",
        },
      },
    },
  },
});

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function MuiWalletSelector() {
  const { account, connected, signMessage, disconnect } = useWallet();
  const { mutate: signIn, isError, error, logout } = useAuth();
  const { toast } = useToast();
  const [hasAttemptedSignIn, setHasAttemptedSignIn] = useState(false);

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (connected) {
        await disconnect();
      }
      showSuccessToast("Logged Out", "You have been successfully logged out.");
    } catch (error) {
      console.error("Logout error:", error);
      showErrorToast("Logout Failed", "Failed to logout. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      // Temporarily disabled login error toast
      toast({
        title: "Wallet Login Failed",
        description:
          "Please try connecting your wallet again. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    const handleSignIn = async () => {
      if (connected && account?.address && !hasAttemptedSignIn) {
        try {
          setHasAttemptedSignIn(true);
          const message = "CLIPPY: INFUSE SOUL INTO HUMANOID ROBOTS";
          const nonce = generateNonce();
          const fullMessage = `${message}`;

          const signResult = await signMessage({
            message: fullMessage,
            nonce,
          });

          if (!signResult.signature) {
            throw new Error("No signature received");
          }

          signIn({
            walletAddress: account.address.toString(),
            signature: signResult.signature.toString(),
            publicKey: account.publicKey?.toString(),
          });
        } catch (error) {
          console.error("Sign in error:", error);
          // Temporarily disabled sign in error toast
          toast({
            title: "Wallet Connection Error",
            description: "Failed to sign message. Please try again.",
            variant: "destructive",
          });
          setHasAttemptedSignIn(false);
        }
      }
    };

    handleSignIn();
  }, [
    connected,
    account?.address,
    account?.publicKey,
    signMessage,
    signIn,
    toast,
    hasAttemptedSignIn,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <WalletConnector />
    </ThemeProvider>
  );
}
