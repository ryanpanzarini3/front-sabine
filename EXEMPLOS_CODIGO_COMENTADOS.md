# 🔍 DEEP DIVE - Exemplos de Código Comentados
## Entenda cada componente linha por linha

---

## 📍 1. App.jsx (Arquivo Principal)

```jsx
// App.jsx - O coração da aplicação

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";

// Importar páginas
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
    // AppProvider = Provider do Context API
    // Qualquer componente dentro pode acessar dados globais via useApp()
    <AppProvider>
      <BrowserRouter basename="/front-sabine">
        {/* basename="/front-sabine" porque está hospedado em subpasta no GitHub Pages */}
        
        <Routes>
          {/* ROTA 1: Login (SEM layout) */}
          {/* Usuário vê só a tela de login, sem sidebar */}
          <Route path="/login" element={<Login />} />
          
          {/* ROTAS 2-10: Todas USAM Layout como wrapper */}
          {/* Layout fornece: Sidebar + Header + Outlet */}
          <Route element={<Layout />}>
            {/* Outlet é como um "buraco" por onde a página entra */}
            
            {/* Dashboard é a primeira página que vê */}
            <Route path="/" element={<Dashboard />} />
```
