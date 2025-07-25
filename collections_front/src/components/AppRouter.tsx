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
import ItemDetailsPage from "../pages/ItemDetailsPage";
import ProfilePage from "../pages/ProfilePage";
import FriendsPage from "../pages/FriendsPage";
import CatList from "../pages/CatList";
import AcceptInvitationPage from "../pages/AcceptInvitationPage";
import FriendItemsPage from "../pages/FriendItemsPage";
import CharacteristicsManagerPage from "../pages/CharacteristicsManagerPage";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/invitations/accept" element={<AcceptInvitationPage />} />
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/"  element={<HomePage />} />
      <Route path="/categories" element={<PrivateRoute element={<CategoriesPage />} />} />
      <Route path="/categories/create" element={<PrivateRoute element={<CreateCategoryPage />} />} />
      <Route path="/categories/:id" element={<PrivateRoute element={<CategoryItemsPage />} />} />
      <Route path="/categories/setup/:id" element={<PrivateRoute element={<CategorySetupPage />} />} />
      <Route path="/categories/info/:id" element={<PrivateRoute element={<CategoryItemsPage />} />} />
      <Route path="/items" element={<PrivateRoute element={<AllItemsPage />} />} />
      <Route path="/items/create" element={<PrivateRoute element={<CreateItemPage />} />} />
      <Route path="/items/create/:categoryId" element={<PrivateRoute element={<CreateItemPage />} />} />
      <Route path="/items/:id" element={<PrivateRoute element={<ItemDetailsPage />} />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/friends" element={<PrivateRoute element={<FriendsPage />} />} />
      <Route path="/catlist" element={<PrivateRoute element={<CatList />} />} />
      <Route path="/friends/:friendId/items" element={<PrivateRoute element={<FriendItemsPage />} />} />
      <Route path="/characteristics" element={<PrivateRoute element={<CharacteristicsManagerPage />} />} />
      <Route path="*" element={<Er404 />} />
    </Routes>
  );
};

export default AppRouter;
