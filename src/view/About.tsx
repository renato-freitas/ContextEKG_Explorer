import { Link } from "react-router-dom";
import { TopBar } from "../layout/TopBar";
import { MHeader } from "../components/MHeader";
import styles from '../styles/global.module.css'

export function About() {
  return (
    <div className={styles.container}>
      <MHeader title={`Sobre`} />
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}