import { Link } from "react-router-dom";
import { TopBar } from "../../layout/TopBar";
import styles from '../../styles/global.module.css'

export function Home() {
  return (
    <div className={styles.container}>
      <h1>Home</h1>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
}