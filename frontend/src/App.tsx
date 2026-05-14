// App.tsx
// Description: Root component — React Router setup with SocketContext and UserContext providers

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { UserProvider } from './context/UserContext';
import { HomePage } from './pages/HomePage';
import { UserInfoPage } from './pages/UserInfoPage';
import { RoomPage } from './pages/RoomPage';
import { ChatPage } from './pages/ChatPage';

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/join/:eventId" element={<UserInfoPage />} />
            <Route path="/room/:eventId" element={<RoomPage />} />
            <Route path="/chat/:matchId" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
