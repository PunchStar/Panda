import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import InputSelector from "src/pages/InputSelector"
import Admin from "./pages/Admin/admin";
import Interview from "./pages/Admin/userLayout";
import UserLayout from "./pages/Admin/userLayout";
import Integration from "./pages/Integration";
import ThoughtBubble from "./pages/ThoughtBubble";

const MainRoute = () => {
  let routes = useRoutes([
    { path: "/input-selector/:partnerId/:interviewId", element: <InputSelector/> },
    { path: "/input-selector/:partnerId/:interviewId/:user", element: <InputSelector/> },
    { path: "/input-selector/:partnerId/:interviewId/:user/:event_link/:event_uuid/:invitee_uuid", element: <InputSelector/> },
    { path: "/integration/:integrationType/:partnerId/:interviewId", element: <Integration/> },
    { path: "/thought-bubble/:partnerId/:interviewId", element: <ThoughtBubble/> },
    {
      path: "admin",
      children:[
        {path:"", element:<Admin/>},
        {path:"user-inputs", element:<UserLayout/>},
        {path:"user-inputs/:partnerId/:interviewId", element:<UserLayout/>},
        {path:"user-inputs/:partnerId/:interviewId/:user", element:<UserLayout/>},
        {path:"user-media", element:<UserLayout/>},
        {path:"user-media/:partnerId/:interviewId", element:<UserLayout/>},
        {path:"user-media/:partnerId/:interviewId/:user", element:<UserLayout/>},
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
