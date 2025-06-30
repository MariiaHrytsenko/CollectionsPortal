import { Routes, Route, Navigate } from "react-router-dom";
import Er404 from "../pages/Er404";
import HomePage from "../pages/HomePage";
import LoginRegister from "../pages/LoginRegister";
import CategoriesPage from "../pages/CategoriesPage";
import CreateCategoryPage from "../pages/CreateCategoryPage";
import AllItemsPage from "../pages/AllItemsPage";
import CategoryItemsPage from "../pages/CategoryItemsPage";
import CategorySetupPage from "../pages/CategorySetupPage";
import CreateItemPage from "../pages/CreateItemPage";
import ProfilePage from "../pages/ProfilePage";
import FriendsPage from "../pages/FriendsPage";
import CatList from "../pages/CatList";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
      <Route path="/categories" element={<PrivateRoute element={<CategoriesPage />} />} />
      <Route path="/categories/create" element={<PrivateRoute element={<CreateCategoryPage />} />} />
      <Route path="/categories/:id" element={<PrivateRoute element={<CategoryItemsPage />} />} />
      {/*<Route path="/categories/:id/items" element={<PrivateRoute element={<CategoryItemsPage />} />} />*/}
      <Route path="/items" element={<PrivateRoute element={<AllItemsPage />} />} />
      <Route path="/items/create" element={<PrivateRoute element={<CreateItemPage />} />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/friends" element={<PrivateRoute element={<FriendsPage />} />} />
      <Route path="/catlist" element={<PrivateRoute element={<CatList />} />} />
      <Route path="*" element={<Er404 />} />
    </Routes>
  );
};

export default AppRouter;
