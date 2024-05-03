import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { MHeader } from "../../components/MHeader";
import { ROUTES } from "../../commons/constants";
import { getsetRepositoryLocalStorage } from "../../commons/utils";
import styles from '../../styles/global.module.css'

export function EndpointConfig() {
  return (
    <div className={styles.container}>

      <MHeader title={`Configurações`} />

      <Grid container>
        <Grid item xs={12}>
          <Stack>
            <Link to="/">Home</Link>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Link to={ROUTES.REPOSITORY_LIST}>
                Endpoint
              </Link>
              <Chip label={getsetRepositoryLocalStorage()} size="small"></Chip>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

// https://freerangestock.com/sample/39701/group-of-kids.jpg