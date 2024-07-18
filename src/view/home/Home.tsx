import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css'
import { LOCAL_STORAGE, NUMBERS, TEXTS } from '../../commons/constants'
import logo from '../../commons/logo-context-ekg-explorer.png'
import { useEffect } from "react";

export function Home() {

  useEffect(() => {
    /**É necessário 'setar' a linguagem noa boot da aplicação */
    window.localStorage.setItem(LOCAL_STORAGE.LANGUAGE,'pt')

    /** Primeiro, verificar se não existe nada no localstorage.globalcontext */
    console.log('home.globalContext', window.localStorage.getItem(LOCAL_STORAGE.GLOBAL_CONTEXT))
    if(window.localStorage.getItem(LOCAL_STORAGE.GLOBAL_CONTEXT) == 'null' || !window.localStorage.getItem(LOCAL_STORAGE.GLOBAL_CONTEXT)){
      window.localStorage.setItem(
        LOCAL_STORAGE.GLOBAL_CONTEXT,'{"language":"pt", "view":'+NUMBERS.CODE_UNIFICATION_VIEW+', "exportedView":"","resourceURI":"","classURI":""}')
    }
  }, [])

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