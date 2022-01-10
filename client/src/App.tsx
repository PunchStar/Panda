import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import MarketList from "src/pages/MarketList"
import InputSelector from "src/pages/InputSelector"
import AnswerAudio from "src/pages/AnswerAudio"
import Thankyou from "./pages/Thankyou";
import AudioResult from "./pages/AudioResult";


const MainRoute = () => {
  let routes = useRoutes([
    { path: "/", element: <MarketList /> },
    { path: '/thank-you', element: <Thankyou />},
    { path: '/audio-result', element: <AudioResult/>},
    { path: "/input-selector", element: <InputSelector />},
    { path: "/input-selector/answer-audio", element: <AnswerAudio />},
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