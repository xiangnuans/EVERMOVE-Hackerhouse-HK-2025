"use client";

import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { ThemeProvider, createTheme } from "@mui/material";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
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
  const { account, connected, signMessage } = useWallet();
  const { mutate: signIn, isError, error } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isError) {
      toast({
        title: "Login Failed",
        description: error?.message || "Failed to login with wallet",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    const handleSignIn = async () => {
      if (connected && account?.address) {
        try {
          const message = "CLIPPY: INFUSE SOUL INTO HUMANOID ROBOTS";
          const nonce = generateNonce();
          const fullMessage = `${message}\nNonce: ${nonce}`;

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
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to sign message",
            variant: "destructive",
          });
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
  ]);

  return (
    <ThemeProvider theme={theme}>
      <WalletConnector />
    </ThemeProvider>
  );
}
