import CreateRule from "./pages/CreateRule";
import { HashRouter, Route, Routes } from "react-router-dom";
import FindPeople from "./pages/FindPeople";
import ExpertKnowMatchConfig from "./pages/ExpertKnowMatchConfig";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route exact path='/create_rule' element={ <CreateRule/> }/>
          <Route exact path='/expert' element={<ExpertKnowMatchConfig />} />
          <Route exact path='/' element={ <FindPeople /> }/>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
