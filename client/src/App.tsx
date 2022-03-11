import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import InputSelector from "src/pages/InputSelector"
import Login from "./components/Login/Login";
import Admin from "./pages/Admin/admin";
import Interview from "./pages/Admin/userLayout";
import UserLayout from "./pages/Admin/userLayout";
import ThoughtBubble from "./pages/ThoughtBubble";
import useToken from './useToken';

const MainRoute = () => {
  const {token, setToken} = useToken();
  let routes = useRoutes([
    { path: "/input-selector/:partnerId/:interviewId", element: <InputSelector/> },
    { path: "/thought-bubble/:partnerId/:interviewId", element: <ThoughtBubble/> },
    {
      path: "admin",
      children:[
        {path:"", element:<Admin/>},
        {path:"user-inputs", element:<UserLayout/>},
        {path:"interviews", element:<Interview/>}
      ]
    }
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