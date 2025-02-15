import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import AuthLayout from './routes/Auth/Auth.jsx';
import Home from './routes/Home.jsx';
import { createBrowserRouter } from "react-router-dom";
import AuthProvider from './context/AuthProvider.jsx';
import PrivateRoute from './routes/Auth/PrivateRoute.jsx';
import Profile from './routes/Hcp/Profile.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import General from './routes/Patient/General_Instruction.jsx';
import Instruction from './routes/Patient/instructions.jsx';
import PassReset from './routes/Auth/PassReset.jsx';
import DrugList from './routes/Hcp/DrugList.jsx';
// import Interaction from './routes/Hcp/interaction.jsx';
import Interaction from './routes/Patient/interactions.jsx';
const queryClient = new QueryClient();
import FoodInteraction from './routes/Patient/FoodInteraction.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/auth" element={<AuthLayout />} />
      <Route path="/general" element={<General />} />
      <Route path="/general/:id" element={<Instruction />} />
      <Route path="/PasswordReset" element={<PassReset />} />
      <Route path="/interactions" element={<Interaction />} />
      <Route path="/food-interaction/:drug_id" element={<FoodInteraction />} />
      <Route path="/interactions" element={<Interaction />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/drug-list" element={<DrugList />} /> {/* Single route for drugs */}
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
