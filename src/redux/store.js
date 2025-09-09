import { configureStore } from '@reduxjs/toolkit';
import registerReducer from './auth/registerSlice';
import loginReducer from './auth/loginSlice';
import learnerReducer from './admin/learnerFormSlice';
import reportsReducer from './admin/reportsSlice';
import resourcesReducer from './parent/resourcesSlice';

const store = configureStore({
  reducer: {
    sign_up: registerReducer,
    login: loginReducer,
    learners: learnerReducer,
    reports: reportsReducer,
    resources: resourcesReducer,
  },
});

export default store;
