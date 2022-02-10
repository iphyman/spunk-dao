import { useWallet } from "contexts/wallet";
import { Nav, Navbar, Container, Button } from "react-bootstrap";

export const Header = () => {
  const { isConnected, toggleWalletModal } = useWallet();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">SpunkDao</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/create-dao">Create Dao</Nav.Link>
          </Nav>
          <Nav>
            {!isConnected && (
              <Button variant="danger" onClick={() => toggleWalletModal(true)}>
                Connect Wallet
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
