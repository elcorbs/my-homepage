import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './index.css';
import App from './App';
import { createBrowserHistory } from "history";
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

ReactDOM.render(
  // <React.StrictMode>
    <Router history={history}>
      <Switch>
        <Route path="/v2" component={() => <h1>V2 coming soon...</h1>} />
        <Route component={App} />
      </Switch>
    </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
