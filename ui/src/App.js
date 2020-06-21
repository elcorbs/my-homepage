import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import RecipesList from "./Pages/RecipesList"
import ViewRecipe from "./Pages/ViewRecipe";
import { createBrowserHistory } from "history";
import { Layout } from "antd"
import "./styles.scss";
import 'antd/dist/antd.css';
const {Header, Content} = Layout;
const history = createBrowserHistory();
function App() {
  return (
    <Layout className="layout">
      <Header>
        <h1 style={{color: "white"}}>My Recipes</h1>
      </Header>
      <Content style={{padding: '0 50px'}}>
        <div className="site-layout-content">
            <Router history={history}>
              <Route exact path="/">
                <Redirect to="/recipes" />
              </Route>
              <Route exact path="/recipes" component={RecipesList} />
              <Route exact path="/recipes/:name" component={ViewRecipe} />
            </Router>
        </div>
      </Content>
  </Layout>
  );
}



export default App;
