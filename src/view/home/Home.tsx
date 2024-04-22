import { Link } from "react-router-dom";
import { TopBar } from "../../layout/TopBar";
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css'

export function Home() {
  return (
    <div className={styles.container}>
      <MHeader title={`Home`} />
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
}