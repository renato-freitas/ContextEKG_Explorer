import { Nav } from 'react-bootstrap';
import s from './NavBar.module.css';

export function NavBar() {
  return (
    <Nav className="justify-content-center mt-1" variant="pills" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/home">Carrega Grafo</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Construir Metagrafo</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2">Disponibilizar</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}