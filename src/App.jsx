import { useState, useEffect } from "react";
import { supabase } from "./components/services/supabaseClient";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading....</div>;

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        <Routes>
          <Route path="/*" element={<Dashboard session={session} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
