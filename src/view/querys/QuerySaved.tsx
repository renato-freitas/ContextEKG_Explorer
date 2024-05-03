import { Link } from "react-router-dom";
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css'

export function QuerySaved() {
  return (
    <div className={styles.container}>
      <MHeader title={`Consultas`} />
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}