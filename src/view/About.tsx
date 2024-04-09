import { Link } from "react-router-dom";
import { TopBar } from "../layout/TopBar";
import styles from '../styles/global.module.css'

export function About() {
  return (
    <div className={styles.container}>
      <h1>Sobre</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}