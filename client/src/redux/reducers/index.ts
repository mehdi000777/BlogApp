import { combineReducers } from 'redux';
import { authReducer } from '../reducers/authReducer';
import { alertReducer } from '../reducers/alertReducer';
import { CategoryReducer } from './categoryReducer';
import { homeBlogReducer } from './homeBlogesReducer';
import { blogsByCategoryReducer } from './blogsByCategoryReducer';
import { userProfileReducer } from './userProfileReducer';
import { blogsReducer } from './blogsReducer';
import { userBlogsReducer } from './userBlogsReducer';
import { commentReducer } from './commentReducer';
import { socketReducer } from './socketReducer';

const reducers = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    categories: CategoryReducer,
    homeBlogs: homeBlogReducer,
    blogsCategory: blogsByCategoryReducer,
    usersProfile: userProfileReducer,
    blogs: blogsReducer,
    userBlogs: userBlogsReducer,
    comments: commentReducer,
    socket: socketReducer
})

export default reducers;