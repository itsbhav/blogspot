import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import DashBoard from "./components/DashBoard";
import UserList from "./components/UserList";
import UserPage from "./components/UserPage";
import Public from "./components/Public";
import PostPagePrivate from "./components/PostPagePrivate";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";
import NewPost from "./components/NewPost"
import EditUser from "./components/EditUser";
function App() {
  return ( 
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public  */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            {/* Protected */}
            <Route path="dash" element={<DashBoard />} />
            <Route path="posts">
              <Route index element={<DashBoard/>}/>
              <Route path="new" element={<NewPost />} />
              <Route path=":id" element={<PostPagePrivate/>} />
            </Route>
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="edit" element={<EditUser/>}/>
              <Route path=":id" element={<UserPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
