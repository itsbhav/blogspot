import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import {jwtDecode} from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    if (token) {
        const decoded = jwtDecode(token)
        const { username,userid} = decoded.UserInfo
        return { username,id:userid }
    }

    return { username: '' ,id:''}
}
export default useAuth