import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import Users from "./pages/Users";
import Departments from "./pages/Departments";
import Categories from "./pages/Categories";
import SLA from "./pages/SLA";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/front-sabine">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chamados" element={<TicketList />} />
            <Route path="/chamados/novo" element={<CreateTicket />} />
            <Route path="/chamados/:id" element={<TicketDetail />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/departamentos" element={<Departments />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/sla" element={<SLA />} />
            <Route path="/notificacoes" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
