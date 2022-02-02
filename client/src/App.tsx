import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import InputSelector from "src/pages/InputSelector"
import AnswerAudio from "src/pages/AnswerAudio"
import Thankyou from "./pages/Thankyou";
import AudioResult from "./pages/AudioResult";


const MainRoute = () => {
  let routes = useRoutes([
    // { path: "/input-selector/:partnerId", element: <InputSelector/>},
    { path: "/input-selector", element: <InputSelector/>},
  ]);
  return routes;
};
const App = () => {
  return (
      <Router>
        <MainRoute />
      </Router>
  );
};

export default App;