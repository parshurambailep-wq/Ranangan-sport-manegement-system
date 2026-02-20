import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

test('auth context exposes login and logout', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
  const { result } = renderHook(() => useAuth(), { wrapper })

  expect(result.current.login).toBeDefined()
  expect(result.current.logout).toBeDefined()

  act(() => {
    result.current.logout()
  })
})

