import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import jwt from 'jsonwebtoken';

import ProtectedRoute from './components/ProtectedRoute';
import Landing from './routes/Landing';
import Login from './routes/Login';

const App = () => (
  <Router>
    <div>
      <Link to="/home">Go home</Link>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute
        exact
        path="/home"
        component={() => {
          const { username } = jwt.decode(localStorage.getItem('token'));
          return (
            <div>Welcome { username }!</div>
          );
        }}
      />
    </div>
  </Router>
);

export default App;
