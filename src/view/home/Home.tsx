import { Link } from "react-router-dom";
import { TopBar } from "../../layout/TopBar";

export function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
}