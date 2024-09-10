import Typography from '@mui/material/Typography'


interface InstantComponentProps {
  instant: string
}

export function InstantComponent(props: InstantComponentProps) {
  function getDateFromInstantTimelin(instantURI: string): any {
    if (instantURI) {
      let lastToken1 = instantURI?.split("/Instant/")[1]
      /** NÃO PODE USAR SPLIT("-") no inicio. TEM ID QUE USA "-" */
      const splitComAno = lastToken1.split('T')[0].split("-")
      const splitComHora = lastToken1.split('T')[1]
      const _d = splitComAno[splitComAno.length - 1]
      const _m = splitComAno[splitComAno.length - 2]
      const _y = splitComAno[splitComAno.length - 3]
      let data = `${_y}-${_m}-${_d}`
      const hora = decodeURIComponent("T" + splitComHora)
      const asDate = new Date(data + hora)
      return <><Typography variant="h6" component="span" >
        {asDate.toLocaleDateString("pt-BR") + " "}
      </Typography >
        <Typography variant="body2" component="span" >
          {asDate.toLocaleTimeString()}
        </Typography >
      </>
    }
    return "";
  }
  return (
    getDateFromInstantTimelin(props.instant)
  )
}