import { Organization } from '../view/organisations/Organisation';
import { Routes, Route, Link } from "react-router-dom";

// https://blog.devgenius.io/implementing-react-router-v6-with-code-splitting-in-a-react-typescript-project-14d98e2cab79


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Organization />} />
    </Routes>
  )
}



