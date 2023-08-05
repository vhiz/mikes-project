import React, { Suspense, useContext, useState } from "react";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import "./style/global.scss";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Books from "./pages/Books/Books";
import { AuthContext } from "./context/authContext";
import Admin from "./pages/admin/Admin";
import Student from "./pages/student/Student";
import AdminBooks from "./pages/AdminBooks/AdminBooks";

const Home = React.lazy(() => import("./pages/Home/Home"));
const Book = React.lazy(() => import("./pages/Book/Book"));

export default function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar o={open} So={setOPen}/>
        <Outlet />
        <Footer />
      </div>
    );
  };
 const [open, setOPen] = useState(false)

  const { currentUser } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: currentUser ? <Layout /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<>...</>}>
              <Home open={open} setOpen={setOPen}/>
            </Suspense>
          ),
        },
        {
          path: "/book/:id",
          element: <Book />,
        },
        {
          path: "/books",
          element: <Books />,
        },
        {
          path: "/addBook",
          element: currentUser?.isAdmin ? <Admin /> : <Navigate to={"/"} />,
        },
        {
          path: "/students",
          element: currentUser?.isAdmin ? <Student /> : <Navigate to={"/"} />,
        },
        {
          path: "/adminBooks",
          element: currentUser?.isAdmin ? (
            <AdminBooks />
          ) : (
            <Navigate to={"/"} />
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}
