import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import CoachDashboard from '../pages/dashboard/CoachDashboard'
import VendorDashboard from '../pages/dashboard/VendorDashboard'
import CricketScoringPage from '../pages/cricket/CricketScoringPage'
import KabaddiTimerPage from '../pages/kabaddi/KabaddiTimerPage'
import MatchCountdownPage from '../pages/timers/MatchCountdownPage'
import EventRegistrationPage from '../pages/payments/EventRegistrationPage'
import TicketBookingPage from '../pages/payments/TicketBookingPage'
import VendorPurchasePage from '../pages/payments/VendorPurchasePage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route element={<ProtectedRoute roles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Coach']} />}>
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/cricket/scoring" element={<CricketScoringPage />} />
          <Route path="/kabaddi/timer" element={<KabaddiTimerPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['Vendor']} />}>
          <Route path="/vendor" element={<VendorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/timers/match" element={<MatchCountdownPage />} />
          <Route path="/payments/events" element={<EventRegistrationPage />} />
          <Route path="/payments/tickets" element={<TicketBookingPage />} />
          <Route path="/payments/vendor" element={<VendorPurchasePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

