import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css'
import { TEXTS } from '../../commons/constants'
import logo from '../../commons/logo-context-ekg-explorer.png'

export function Home() {
  return (
    <div className={styles.container}>
      <MHeader title={`Home`} />
      {/* <nav>
        <Link to="/about">About</Link>
      </nav> */}
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Logo" />
      </div>
      <div style={{ textAlign: "center", width: window.innerWidth/2 }}>
        <Typography style={{ textAlign: "justify"  }}>
          Ferramenta para exploração baseada em contexto da visão semântica de <i>Enterprise Knowledge Graphs</i>.
        </Typography>
        <br />
        <Typography style={{ textAlign: "justify"  }}>
          Os artistas musicais incluem cantores, grupos, compositores, produtores etc.
        </Typography>
      </div>

    </div>
  );
}