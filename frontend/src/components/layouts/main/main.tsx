import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from '../signup/Signup.tsx';


function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Main;
