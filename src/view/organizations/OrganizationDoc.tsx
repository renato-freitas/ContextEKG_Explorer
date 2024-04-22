import { Link } from "react-router-dom";
import { ROUTES } from "../../commons/constants";
import { MHeader } from "../../components/MHeader";
import styles from '../../styles/global.module.css';

export function OrganizationDoc() {
  return (
    <div className={styles.container}>
      <MHeader title={`Organizações`} />
      <nav>
        <Link to={ROUTES.ORGANIZATION_LIST}>Voltar</Link>
      </nav>

      <div>
        <ul>
          <li>No nosso contexto, X é uma <b>Organização.</b></li>
          <li>Uma Organização mantém/gerencia/distribui uma ou mais <b>Fontes de Dados</b>.</li>
          <li>Uma Fonte de Dados é qualquer artefato que armazena dados e que pode ser lido por computador.</li>
          <li>Exemplos de Fontes de Dados são: <b>BDR</b>, <b>BD Non-SQL</b>, <b>TripleStore</b>, <b>Arquivos Digitais</b>, <b>Sensores IoT</b>, etc</li>
          <li>Arquivos Digitais são: <b>PDF</b>, <b>EXCEL</b>, <b>CSV</b>, <b>JSON</b>, <b>XML</b>, <b>VIDEO</b>, <b>AÚDIO</b>, <b>IMAGEM</b></li>
          <br/>
          <li>Um BDR tem uma ou mais <b>Tabelas</b></li>
          <li>Uma Tabela tem uma ou mais <b>Colunas</b></li>
          <br/>
          <li>O nome do CSV é mapeado para uma Tabela</li>
          <li>As propriedades do CSV são mapeados para Colunas</li>
          
        </ul>
      </div>
    </div>
  );
}