import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import DebtScreen from "./components/DebtScreen.jsx";
import ReferenceScreen from "./components/ReferenceScreen.jsx";
import ReferenceDetailScreen from "./components/ReferenceDetailScreen.jsx";
import FaqScreen from "./components/FaqScreen.jsx";
import Loader from "./components/Loader.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import PageTransition from "./components/PageTransition.jsx";
import data from "./data.json";

export default function App() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (data) {
      setAppData(data);
    } else {
      setAppData(null);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!appData) {
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
                  <DebtScreen debt={appData.debt} />
                </PageTransition>
              }
            />
            <Route
              path="/reference"
              element={
                <PageTransition>
                  <ReferenceScreen reference={appData.reference} />
                </PageTransition>
              }
            />
            <Route
              path="/reference/:slug"
              element={
                <PageTransition>
                  <ReferenceDetailScreen reference={appData.reference} />
                </PageTransition>
              }
            />
            <Route
              path="/faq"
              element={
                <PageTransition>
                  <FaqScreen faq={appData.faq} />
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
