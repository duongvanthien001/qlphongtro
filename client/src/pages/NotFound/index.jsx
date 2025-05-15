import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="display-1">404</h1>
      <p className="lead">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Go back to Home
      </Link>
    </div>
  );
}
