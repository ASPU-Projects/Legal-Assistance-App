import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { stateRedux } from "../types";
import { dir } from "i18next";
import Nav from "../components/nav/Nav";
import Footer from "../components/Footer/Footer";
import ConversationsPage from "../pages/Conversations";
import IssuesPage from "../pages/Issues";
import IssuePage from "../pages/Issue";
import AgencyPage from "../pages/Agency";
import AgenciesPage from "../pages/Agencies";
import CourtsPage from "../pages/Courts";
import LawyerPage from "../pages/Lawyer";
import LawyersPage from "../pages/Lawyers";
import AboutPage from "../pages/About";
import HomePage from "../pages/Home";
import NotFoundPage from "../pages/Page404";
import LogupPage from "../pages/Logup";
import LoginPage from "../pages/Login";
import VerifyEmailPage from "../pages/VerifyEmail";

export default function Container() {
  const isAuth = useSelector((state: stateRedux) => state.auth.authenticate);
  const language = useSelector((state: stateRedux) => state.language.language);

  useEffect(() => {
    document.documentElement.dir = dir(language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <BrowserRouter>
      {!isAuth ? (
        <Routes>
          <Route path="logup" element={<LogupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="verify" element={<VerifyEmailPage />} />
          <Route path="*" element={<Navigate to="login" />} />
        </Routes>
      ) : (
        <div>
          <div className="min-h-screen flex flex-col">
            <Nav />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/logup" element={<Navigate to="/home" />} />
                <Route path="/login" element={<Navigate to="/home" />} />
                <Route path="/verify-code" element={<Navigate to="/home" />} />
                <Route path="home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="lawyers" element={<LawyersPage />} />
                <Route path="lawyers/:id" element={<LawyerPage />} />
                {localStorage.getItem("role") !== "user" ? (
                  <Route path="courts" element={<CourtsPage />} />
                ) : (
                  ""
                )}
                <Route path="agencies" element={<AgenciesPage />} />
                <Route path="agencies/:id" element={<AgencyPage />} />{" "}
                {localStorage.getItem("role") !== "representative" ? (
                  <>
                    <Route path="issues" element={<IssuesPage />} />
                    <Route path="issues/:id" element={<IssuePage />} />{" "}
                    <Route path="conversations" element={<ConversationsPage />} />
                  </>
                ) : (
                  ""
                )}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
