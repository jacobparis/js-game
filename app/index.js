import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import HomeScene from "./scenes/home";
import GameScene from "./scenes/game";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/home" component={HomeScene} />
                <Route path="/game/:id" component={GameScene} />
                <Redirect from="/game" to="/home" />
                <Redirect from="/" to="/home" />
            </Switch>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById("root")); 