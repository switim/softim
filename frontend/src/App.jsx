import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './pages/EventsPage.jsx';
import AppShell from './pages/AppShell.jsx';
import AblaufModule from './modules/ablauf/AblaufModule.jsx';
import TechnikModule from './modules/technik/TechnikModule.jsx';
import LichtModule from './modules/licht/LichtModule.jsx';
import MusikModule from './modules/musik/MusikModule.jsx';
import VideoModule from './modules/video/VideoModule.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Event-Auswahl (Startseite) */}
        <Route path="/" element={<EventsPage />} />

        {/* App-Shell für ein spezifisches Event */}
        <Route path="/event/:slug" element={<AppShell />}>
          <Route index element={<Navigate to="ablauf" replace />} />
          <Route path="ablauf" element={<AblaufModule />} />
          <Route path="technik" element={<TechnikModule />} />
          <Route path="licht" element={<LichtModule />} />
          <Route path="musik" element={<MusikModule />} />
          <Route path="video" element={<VideoModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
