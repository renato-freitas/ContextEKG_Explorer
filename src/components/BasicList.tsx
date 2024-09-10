import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import { useNavigate } from 'react-router-dom';

interface BasicListProps {
  dataset: any[],
  hasIcon?: boolean,
  hasActions?: boolean,
  children: React.ReactNode;
}

export default function BasicList(props: BasicListProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        {
          props.dataset.map((resource, idx) => <ListItemButton
            selected={selectedIndex === idx}
            onClick={(event) => handleListItemClick(event, idx)}
          >
            {props?.hasIcon && <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>}
            <ListItemText primary={resource.label?.value} />
            {props.children}
          </ListItemButton>)
        }
      </List>
    </Box>
  );
}