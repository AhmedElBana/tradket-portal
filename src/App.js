import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import {auth} from './tools/Auth';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Website = React.lazy(() => import('./views/Pages/Website'));
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Forget = React.lazy(() => import('./views/Pages/Forget'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {

  render() {
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
            <Route exact path="/" name="Website Page" render={props => <Website {...props}/>} />
              <BrowserRouter basename="/portal">
                <React.Suspense fallback={loading()}>
                  <Switch>
                    <Route exact path="/login" name="Login Page" component={!auth.isLoggedIn() ? Login :  DefaultLayout } />
                    <Route exact path="/register" name="Register Page" component={!auth.isLoggedIn() ? Register :  DefaultLayout } />
                    <Route exact path="/forget" name="Reset password" component={!auth.isLoggedIn() ? Forget :  DefaultLayout } />
                    <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
                    <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
                    <Route path="/" name="Home" component={auth.isLoggedIn() ? DefaultLayout :  Login } />
                  </Switch>
                </React.Suspense>
            </BrowserRouter>
            
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
