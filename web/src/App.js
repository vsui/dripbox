import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom';

const App = () => (
  <Router>
    <div>
      <Route path="/" component={() => <div>hi</div>} />
    </div>
  </Router>
);

export default App;
