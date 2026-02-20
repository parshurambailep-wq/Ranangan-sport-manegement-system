import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'

function Protected() {
  return <div>Protected</div>
}

test('redirects unauthenticated users to login', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<Protected />} />
          </Route>
          <Route path="/auth/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )

  expect(screen.getByText(/Login/i)).toBeInTheDocument() 
})

