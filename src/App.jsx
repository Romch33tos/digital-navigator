import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import DebtScreen from "./components/DebtScreen.jsx";
import ReferenceScreen from "./components/ReferenceScreen.jsx";
import FaqScreen from "./components/FaqScreen.jsx";
import Loader from "./components/Loader.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import PageTransition from "./components/PageTransition.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    fetch("/src/data.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("network");
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Header />
      <main className="container">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomeScreen />
                </PageTransition>
              }
            />
            <Route
              path="/debt"
              element={
                <PageTransition>
                  <DebtScreen debt={data.debt} />
                </PageTransition>
              }
            />
            <Route
              path="/reference"
              element={
                <PageTransition>
                  <ReferenceScreen reference={data.reference} />
                </PageTransition>
              }
            />
            <Route
              path="/faq"
              element={
                <PageTransition>
                  <FaqScreen faq={data.faq} />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}
