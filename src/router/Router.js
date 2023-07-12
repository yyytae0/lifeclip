import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import UserList from "../components/UserList"

function Router() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/"/>
        </Routes>
        <UserList/>
        </BrowserRouter>
    )
}
export default Router;