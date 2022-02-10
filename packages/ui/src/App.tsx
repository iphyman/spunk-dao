import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SpinLoader } from "components/Loader";
import { Header } from "components/Header";
import { useWallet } from "contexts/wallet";

const CreateDao = lazy(() => import("pages/CreateDao"));
const CreateDaoProposal = lazy(() => import("pages/CreateDaoProposal"));
const DaoProfile = lazy(() => import("pages/DaoProfile"));
const DaoProposals = lazy(() => import("pages/DaoProposals"));
const Home = lazy(() => import("pages/Home"));

const WalletsModal = lazy(() => import("components/Modal/WalletsModal"));

function App() {
  const { isWalletModalOpen, toggleWalletModal } = useWallet();

  return (
    <div className="appWrapper">
      <Header />
      <div className="pageWrapper">
        <Suspense fallback={<SpinLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-dao" element={<CreateDao />} />
            <Route path="/new-proposal" element={<CreateDaoProposal />} />
            <Route path="/:organization" element={<DaoProfile />} />
            <Route path="/:organization/proposals" element={<DaoProposals />} />
          </Routes>
          {/* Add All lazy loaded components */}
          <WalletsModal
            show={isWalletModalOpen}
            onHide={() => toggleWalletModal(false)}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
