import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css'
import logo from '../../commons/logo-context-ekg-explorer.png'

export function Home() {
  const global_context = useSelector((state: RootState) => state.globalContext)

  return (
    <div className={styles.container}>
      <MHeader title={`Home`} />
     
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Logo" />
      </div>

      <div style={{ textAlign: "center", width: window.innerWidth / 2 }}>
        {
          global_context.language == 'pt'
            ? <><Typography style={{ textAlign: "justify" }}>Uma Ferramenta Interativa para Exploração Contextual da Visão Semântica em Sistemas de <i>Enterprise Knowledge Graphs</i>.</Typography>
              <br />
              <Typography style={{ textAlign: "justify" }}>Os artistas musicais incluem cantores e grupos musicais.</Typography>
            </>

            : <><Typography style={{ textAlign: "justify" }}>An Interactive Tool for Contextual Exploration of Semantic View in Enterprise Knowledge Graph Systems.</Typography>
              <br />
              <Typography style={{ textAlign: "justify" }}>Musical artists include singers and musical groups.</Typography>
            </>
        }
      </div>
    </div>
  );
}