import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Notfound from './pages/Notfound';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import Alert from './components/alert/Alert';
import Active from './pages/Active';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshToken } from './redux/actions/authActions';
import Profile from './pages/Profile';
import Category from './pages/Category';
import { getCategroies } from './redux/actions/categoryActions';
import BlogsByCategory from './pages/BlogsByCategory';
import CreateBlog from './pages/CreateBlog';
import { getHomeBlogs } from './redux/actions/blogActions';
import Blog from './pages/Blog';
import io from 'socket.io-client';
import SocketClient from './SocketClient';
import UpdateBlog from './pages/UpdateBlog';
import ForgetPassowrd from './pages/forget_password';
import ResetPassword from './pages/reset_password';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHomeBlogs());
    dispatch(getCategroies());
    dispatch(refreshToken());
  }, [dispatch])

  useEffect(() => {
    const socket = io();
    dispatch({ type: "SOCKET", payload: socket });
    return () => { socket.close() }
  }, [dispatch])

  return (
    <div className="container">
      <BrowserRouter>
        <SocketClient />
        <Alert />
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/active/:active_token" component={Active} exact />
          <Route path="/profile/:id" component={Profile} exact />
          <Route path="/category" component={Category} exact />
          <Route path="/create_blog" component={CreateBlog} exact />
          <Route path="/blogs/:category" component={BlogsByCategory} exact />
          <Route path="/blog/:id" component={Blog} exact />
          <Route path="/update_blog/:id" component={UpdateBlog} exact />
          <Route path="/forget_password" component={ForgetPassowrd} exact />
          <Route path="/reset_password/:token" component={ResetPassword} exact />
          <Route component={Notfound} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
