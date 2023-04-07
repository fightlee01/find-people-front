import CreateRule from "./pages/CreateRule";
import { HashRouter, Route, Routes } from "react-router-dom";
import FindPeople from "./pages/FindPeople";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route exact path='/' element={ <CreateRule/> }/>
          <Route exact path='/find-people' element={ <FindPeople /> }/>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
