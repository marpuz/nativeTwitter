import * as React from "react";
import MainContainer from "./Components/MainContainer";
import { AuthContextProvider } from "./Components/Context";

function App() {
  return (
    <AuthContextProvider>
      <MainContainer />
    </AuthContextProvider>
  );
}

export default App;
