import { store } from '../../app/store'
import { postsApiSlice } from '../posts/postsSlice'
import { usersApiSlice } from '../users/usersSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';


const Prefetch = () => {
    useEffect(() => {
        store.dispatch(postsApiSlice.util.prefetch('getAllPosts', 'postsList', { force: true }))
        store.dispatch(postsApiSlice.util.prefetch('getPosts', 'postsList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsersById', 'usersList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch("getRecommendations", "usersList", { force: true }))
    }, [])
    return <Outlet />
}
export default Prefetch
