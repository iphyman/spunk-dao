import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { allowedWallets, SessionWallet } from "algorand-session-wallet";

export type AllowedWallets = keyof typeof allowedWallets;
export type SupportedNetworks = "MainNet" | "TestNet" | "BetaNet";

const WalletContext = createContext<{
  isWalletModalOpen: boolean;
  isConnected: boolean;
  activeNetwork: SupportedNetworks;
  accounts: string[];
  connect: (wallet: AllowedWallets) => void;
  setActiveNetwork: (network: SupportedNetworks) => void;
  toggleWalletModal: (state: boolean) => void;
} | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isWalletModalOpen, _setWalletModalState] = useState<boolean>(false);
  const [isConnected, _setConnectionState] = useState<boolean>(false);
  const [accounts, _setAccountState] = useState<string[]>([]);
  const [activeNetwork, _setActiveNetwork] =
    useState<SupportedNetworks>("TestNet");

  const setActiveNetwork = (network: SupportedNetworks) => {
    _setActiveNetwork(network);
  };

  const toggleWalletModal = (state: boolean) => {
    _setWalletModalState(state);
  };

  const connect = async (wallet: AllowedWallets) => {
    const sw = new SessionWallet(
      activeNetwork,
      sessionWallet.permissionCallback,
      wallet
    );

    await sw.connect();

    const interval = setInterval(() => {
      const walletConnect = localStorage.getItem("walletconnect");
      if (
        walletConnect === null ||
        walletConnect === undefined ||
        walletConnect === ""
      )
        return;

      const walletConnectData = JSON.parse(walletConnect);
      const accounts = walletConnectData.accounts;
      if (accounts.length > 0) {
        clearInterval(interval);
        sw.setAccountList(walletConnectData.accounts);
        _setAccountState(sw.accountList());
        _setConnectionState(sw.connected());
      }
    }, 250);

    toggleWalletModal(false);
  };

  const sessionWallet = new SessionWallet(activeNetwork);

  useEffect(() => {
    if (sessionWallet.connected()) return;

    let interval: any;

    sessionWallet.connect().then((res) => {
      if (!res) return;

      interval = setInterval(() => {
        if (sessionWallet.connected()) {
          clearInterval(interval);
          _setAccountState(sessionWallet.accountList());
          _setConnectionState(sessionWallet.connected());
        }
      }, 500);
    });
  }, [activeNetwork]);

  console.log(isConnected);

  return (
    <WalletContext.Provider
      value={{
        accounts,
        activeNetwork,
        connect,
        isConnected,
        isWalletModalOpen,
        setActiveNetwork,
        toggleWalletModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) throw new Error("Missing Wallet context");

  const {
    accounts,
    activeNetwork,
    connect,
    isConnected,
    isWalletModalOpen,
    setActiveNetwork,
    toggleWalletModal,
  } = context;

  return {
    accounts,
    activeNetwork,
    connect,
    isConnected,
    isWalletModalOpen,
    setActiveNetwork,
    toggleWalletModal,
  };
};
