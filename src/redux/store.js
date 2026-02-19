import { configureStore } from '@reduxjs/toolkit';
import registerReducer from './auth/registerSlice';
import loginReducer from './auth/loginSlice';
import learnerReducer from './admin/learnerFormSlice';
import reportsReducer from './admin/reportsSlice';
import resourcesReducer from './parent/resourcesSlice';
import logoutReducer from './auth/logoutSlice';
import profileReducer from './profileSlice';
import adminLearnerReducer from './admin/adminLearnerSlice';
import teacherReducer from './teacherSlice';
import adminPacesReducer from './admin/pacesSlice';
import learnerPacesReducer from './parent/pacesSlice';

const store = configureStore({
  reducer: {
    sign_up: registerReducer,
    login: loginReducer,
    learners: learnerReducer,
    reports: reportsReducer,
    resources: resourcesReducer,
    logout: logoutReducer,
    profile: profileReducer,
    adminLearners: adminLearnerReducer,
    teacher: teacherReducer,
    adminPaces: adminPacesReducer,
    learnerPaces: learnerPacesReducer,
  },
});

export default store;
