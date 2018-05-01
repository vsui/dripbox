import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './routes/Home';
import Landing from './routes/Landing';
import Login from './routes/Login';

const App = () => (
  <Router>
    <div style={{ height: '100vh' }}>
      <Header />
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute
        exact
        path="/logout"
        component={() => {
          localStorage.removeItem('token');
          return <Redirect to="/login" />;
        }}
      />
      <ProtectedRoute
        path="/home"
        component={Home}
      />
      <ToastContainer />
    </div>
  </Router>
);

export default App;
