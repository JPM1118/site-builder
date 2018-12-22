import React from 'react';
import { Route, Switch, } from 'react-router-dom';
import LoginPage from './LoginPage';
import Nav from './Nav';

export default props => {
  return (
    <div>
      <Nav />
      <Switch>
        <Route path='/login' component={LoginPage} />
      </Switch>
    </div>
  );
};
