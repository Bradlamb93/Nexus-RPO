import { useState } from "react";
import { AppShell } from "./app/AppShell.jsx";
import { AuthScreen } from "./features/auth/AuthScreen.jsx";

/* ─── ROOT ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [user,setUser] = useState(null);
  return user
    ? <AppShell user={user} onLogout={()=>setUser(null)}/>
    : <AuthScreen onAuth={setUser}/>;
}
