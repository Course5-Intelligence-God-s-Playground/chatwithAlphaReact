import React from 'react'
import { useRecoilValue } from 'recoil'
import { Navigate, Outlet } from 'react-router-dom'
import { loginState } from './loginRecoil'
function ProtectedRoute() {
    const loggedState = useRecoilValue(loginState)
    
    return (

        loggedState ? <Outlet /> : <Navigate to='/' replace />

    )
}

export default ProtectedRoute
