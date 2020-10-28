import React, { useState } from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import RecipesPage from "./Pages/RecipesPage"
import ViewRecipe from "./Pages/ViewRecipe";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "./Gateway/query-recipes";
import { Layout, Button, Input } from "antd";
import Notes from "./Pages/Notes";
import './App.less'
import "./styles.scss";
const { Header, Content } = Layout;
function App() {
  return (
    <main>
      <Switch>
        <Route exact path="/">
          <Redirect to="/recipes" />
        </Route>
        <Route exact path="/recipes" component={pageWrapper({ sectionTitle: "Recipes", children: RecipesPage })} />
        <Route exact path="/recipes/:name" component={pageWrapper({ sectionTitle: "Recipes", children: ViewRecipe })} />
        <Route path="/notes" component={pageWrapper({ sectionTitle: "Engineering Cheatsheet", children: Notes })} />
        <Route exact path="/logout" component={Logout} />
        <Route component={NoMatch} />
      </Switch>
    </main>
  );
}
function Logout(props) {
  localStorage.removeItem("emmas-recipes-token");
  props.history.goBack();
  return <div />
}
function NoMatch(props) {
  console.log(props)
  return <div>Can't find the page you're looking for </div>
}

function pageWrapper({ sectionTitle, children }) {
  return (props) => {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') || false)
    return (<Layout className="layout" >
      <Header className="app-header">
        <h1 style={{ color: "#9d646e" }}>{sectionTitle}</h1>
        <div className="header-content">
          <LoginForm cb={setLoggedIn}/>
          <div className="site-navigation">
            <Link to="/">About Me</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/notes">Notes</Link>
            {loggedIn && <a href="/logout">Logout</a>}
          </div>
        </div>
      </Header>
      <Content className="main-content" >
        <div className="site-layout-content">
          {children(props)}
        </div>
      </Content>
    </Layout>)
  }
}

function LoginForm({cb}) {
  const [username, setUsename] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') || false);
  const postLogin = () => {
    setLoggedIn(true);
    cb(true);
  }
  const submitLoginForm = () => {
    setErrorMessage(null);
    login(username, password, (user) => user ? postLogin() : userNotFound())
  }
  const userNotFound = () => {
    setErrorMessage(`Username/password combination is incorrect`)
  }

  if (loggedIn) return null;

  return (
    <div className={"login-form-container"} style={{ textAlign: "center", margin: "0 5px", paddingBottom: "10px" }} >
      {errorMessage}
      <Input
        placeholder="Enter your username"
        prefix={<UserOutlined className="site-form-item-icon" />}
        onChange={value => setUsename(value.target.value)}
        className={"login-form-item"}
      />
      <Input.Password
        placeholder="Enter your password"
        prefix={<LockOutlined />}
        onChange={value => setPassword(value.target.value)}
        className={"login-form-item"}
      />
      <Button
        type="primary"
        onClick={submitLoginForm}
        className={"login-form-item"}
      >
        Login
      </Button>
    </div>
  )
}



export default App;
