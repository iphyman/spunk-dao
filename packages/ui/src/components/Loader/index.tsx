import { Spinner } from "react-bootstrap";

export const SpinLoader = () => {
  return (
    <div className="loaderContainer">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};
