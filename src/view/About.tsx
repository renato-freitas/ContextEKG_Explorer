import { Link } from "react-router-dom";
import { TopBar } from "../layout/TopBar";

export function About() {
  return (
    <div>
      <h1>Sobre</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}