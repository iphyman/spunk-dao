import { Alert, Modal, Button, ModalProps } from "react-bootstrap";
import MyAlgoWalletLogo from "assets/images/MyAlgoWalletLogo.svg";
import WalletConnectLogo from "assets/images/WalletConnectLogo.svg";
import { useWallet } from "contexts/wallet";

export default function WalletsModal(props: ModalProps) {
  const { connect } = useWallet();

  return (
    <Modal
      {...props}
      dialogClassName="walletConnectorModal"
      aria-labelledby="show-supported-wallets"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="show-supported-wallets">Connect a wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <p>Connect with any of the below supported wallets to continue.</p>
        </Alert>
        <Button
          variant="secondary"
          className="connectorButton"
          onClick={() => connect("algo-signer")}
        >
          <div>AlgoSigner</div>
          <div className="connectorImage">
            <img
              src="https://lh3.googleusercontent.com/q6YDjVcO1MQEvfJpNC59-d7RsqbD8zaDjMaMCqOVYMXFyjuuQIhAsSuG4LrciSBgik0KuJwfGZGWIvEjRFRHaH4h=w128-h128-e365-rj-sc0x00ffffff"
              alt="AlgoSigner"
            />
          </div>
        </Button>
        <Button
          variant="secondary"
          className="connectorButton"
          onClick={() => connect("my-algo-connect")}
        >
          <div>MyAlgoWallet</div>
          <div className="connectorImage">
            <img src={MyAlgoWalletLogo} alt="MyAlgo Wallet" />
          </div>
        </Button>
        <Button
          variant="secondary"
          className="connectorButton"
          onClick={() => connect("wallet-connect")}
        >
          <div>WalletConnect</div>
          <div className="connectorImage">
            <img src={WalletConnectLogo} alt="WalletConnect" />
          </div>
        </Button>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}
