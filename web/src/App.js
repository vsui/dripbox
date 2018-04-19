import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import jwt from 'jsonwebtoken';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './routes/Home';
import Landing from './routes/Landing';
import Login from './routes/Login';

const App = () => (
  <Router>
    <div>
      <Link to="/home">Go home</Link>
      <Header />
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute
        exact
        path="/home"
        component={Home}
      />
    </div>
  </Router>
);

export default App;
