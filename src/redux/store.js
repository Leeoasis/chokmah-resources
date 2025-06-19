import { configureStore } from '@reduxjs/toolkit';
import registerReducer from './auth/registerSlice';
import loginReducer from './auth/loginSlice';
import learnerReducer from './admin/learnerFormSlice';
import reportsReducer from './admin/reportsSlice';

const store = configureStore({
  reducer: {
    sign_up: registerReducer,
    login: loginReducer,
    learners: learnerReducer,
    reports: reportsReducer,
  },
});

export default store;
