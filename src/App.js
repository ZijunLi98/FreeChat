import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import UserProvider from "./contexts/UserContext";
import ChatPage from "./pages/ChatPage/ChatPage";
import EmailVerify from "./components/EmailVerify/EmailVerify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgetPasswordPage from "./pages/LoginPage/ForgetPasswordPage";
import ResetPassword from "./components/ResetPassword/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "/signup", element: <LoginPage /> },
      { path: "/forgetPassword", element: <ForgetPasswordPage /> },
      {
        path: "/chat/:uuid",
        element: <ChatPage />,
      },
      { path: "/emailverify/:verifyToken", element: <EmailVerify /> },
      { path: "/emailreset/:verifyToken", element: <ResetPassword /> },
    ],
  },
]);

function App() {
  window.onbeforeunload = function () {
    localStorage.removeItem("access_token");
  };
  return (
    <UserProvider>
      <ToastContainer
        style={{ width: "100vw" }}
        autoClose={1000}
        closeOnClick
        limit={2}
      />
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
