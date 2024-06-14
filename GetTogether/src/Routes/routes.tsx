import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Geturl from "../components/Geturl";
import VideoCalling from "../components/VideoCalling";
import Room1 from "../Rooms/Room1";
import Home from "../components/Home";
import Login from "../components/Login";
import Signup from "../components/Signup"


export const routes = createBrowserRouter([
    {
        path:'/video',
        Component: Geturl,
    },
    {
        path:'/room/:roomid',
        Component: Room1,
    },
    {
        path:'/',
        Component: Home,
    },
    {
        path:'/login',
        Component: Login,
    },
    {
        path:'/signup',
        Component: Signup,
    },
]);