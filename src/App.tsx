import React, { Suspense } from "react";
import Navbar from "@components/organisms/Navbar";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@components/pages/Authentication/ProtectedRoute";
import PlayableMediaProvider from "@contexts/PlayableMediaContext";

// Code splitting using React.lazy
const Home = React.lazy(() => import("@components/pages/Contents/Home"));
const Clips = React.lazy(() => import("@components/pages/Contents/Clips"));
const Images = React.lazy(() => import("@components/pages/Contents/Images"));
const Applications = React.lazy(
  () => import("@components/pages/Contents/Applications")
);
const Audios = React.lazy(() => import("@components/pages/Contents/Audios"));
const Profile = React.lazy(() => import("@components/pages/Contents/Profile"));
const NotFound = React.lazy(
  () => import("@components/pages/Authentication/NotFound")
);

function App() {
  return (
    <main className="min-h-screen bg-[#252627]">
      <Navbar />
      <ProtectedRoute>
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center" />
          }
        >
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/clips"
              element={
                <PlayableMediaProvider>
                  <Clips />
                </PlayableMediaProvider>
              }
            />
            <Route path="/images" element={<Images />} />
            <Route path="/applications" element={<Applications />} />
            <Route
              path="/audios"
              element={
                <PlayableMediaProvider>
                  <Audios />
                </PlayableMediaProvider>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ProtectedRoute>
    </main>
  );
}

export default App;
