import React from 'react';
import Main from "./Main";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Third from './Third'
import Fifth from "./Fifth";
// import FirstLab from "./lab1/FirstLab";

class App extends React.Component{
  render(){
    return (
        <Router>
          <div>
            <Route path="/" exact component={Main}/>
            <Route path="/third" exact component={Third}/>
              <Route path="/fifth" exact component={Fifth}/>
              {/*<Route path="/first" exact component={FirstLab}/>*/}

          </div>
        </Router>
    )
  }
};

export default App;
