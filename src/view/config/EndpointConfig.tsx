import { Link } from "react-router-dom";
import { TopBar } from "../../layout/TopBar";
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css'

export function EndpointConfig() {
  return (
    <div className={styles.container}>
      <MHeader title={`Configuração de Endpoint`} />
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}