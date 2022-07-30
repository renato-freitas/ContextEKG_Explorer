import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

interface ListContainerProps {
  children?: React.ReactNode;
}

export function ListContainer(props: ListContainerProps) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            overflow: {
              xs: 'auto',
              sm: 'unset',
            },
          }}
        >
          {props.children}
        </Box>
      </CardContent>
    </Card>
  )
}