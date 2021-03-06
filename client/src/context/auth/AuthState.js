import { useReducer } from 'react'
import AuthContext from './authContext'
import AuthReducer from './authReducer'
import axios from 'axios'
import {REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, CLEAR_ERRORS, USER_LOADED, AUTH_ERROR, LOGOUT} from '../types.js'
import setAuthToken from '../../utils/setAuthToken'

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        user: null,
        isAuthenticated: null,
        loading: true,
        error: null
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // load USer

    const loadUser = async () => {
        if(localStorage.token){
            setAuthToken(localStorage.token)
        }

        try {
            const res = await axios.get('api/v1/auth')
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: AUTH_ERROR,
            })
        }
    }

    // Register USer

    const registerUser = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('api/v1/users', formData, config)

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: REGISTER_FAIL,
                payload: error.response.data.message
            })
        }

        loadUser()
    }

    // Login User

    const loginUser = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('api/v1/auth', formData, config)

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: LOGIN_FAIL,
                payload: error.response.data.message
            })
        }

        loadUser()
    }

    // Logout

    const logout = () => {
        dispatch({type: LOGOUT})
    }

    // clear error

    const clearError = () => {
        dispatch({type: CLEAR_ERRORS})
    }

    // Filter Contact

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                error: state.error,
                user: state.user,
                loadUser,
                registerUser,
                clearError,
                logout,
                loginUser,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState

