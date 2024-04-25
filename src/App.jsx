import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import PaymentStep1 from './pages/payment_step1'
import PaymentStep2 from './pages/payment_step2'
import PaymentStep3 from './pages/payment_step3'
import PaymentResult from './pages/payment_result'
import ErrorPage from './pages/error_page'

function App() {

  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/payment-step1" element={<PaymentStep1/>}></Route>
          <Route path="/payment-step2" element={<PaymentStep2/>}></Route>
          <Route path="/payment-step3" element={<PaymentStep3/>}></Route>
          <Route path="/payment-result" element={<PaymentResult/>}></Route>
          <Route path="*" element={<ErrorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App