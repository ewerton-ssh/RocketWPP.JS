import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/auth';
import StatusProvider from './contexts/status';
import Routes from './routes';
import { Slide, ToastContainer } from 'react-toastify';
import BotProvider from './contexts/chatbot';

function App() {
  return (
    <AuthProvider>
      <StatusProvider>
        <BotProvider>
          <BrowserRouter>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              transition={Slide}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Routes />
          </BrowserRouter>
        </BotProvider>
      </StatusProvider>
    </AuthProvider>
  );
}

export default App;