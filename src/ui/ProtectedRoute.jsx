import React, { useEffect } from 'react'
import { useUser } from '../features/authentication/useUser'
import Spinner from './Spinner'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Fullpage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function ProtectedRoute({children}) {

    const navigate = useNavigate();

    //1. Load the authenticated user
    const { isAuthenticated, isLoading } = useUser()

    //2. If there is NO authenticated user, redirect to the /login
    useEffect(()=>{
        if(!isAuthenticated && !isLoading) navigate("/login")
    }, [isAuthenticated, isLoading, navigate])

    //3. While loading, sho a spinner
    if(isLoading) return (
        <Fullpage>
            <Spinner />
        </Fullpage>
    )

    //4. If there IS a user, render the app normally
  if(isAuthenticated) return children
}
