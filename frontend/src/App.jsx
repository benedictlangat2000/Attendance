import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import Profile from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
import PrivateRoute from './Components/PrivateRoute';
import Clock from './Components/Landing';
import AddBranch from './Components/AddBranch';
import Branch from './Components/Branch';
import EmployeeDashboard from './Components/EmployeeDashboard';
import MarkAttendance from './Components/MarkAttendance';
import AttendanceReport from './Components/AttendanceReport';
import EmployeeSignup from './Components/EmployeeSignup';
import UserReport from './Components/UseReport';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Clock />} />
        <Route path='/start' element={<Start />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />} />
        <Route path='/employee_detail/:id' element={<EmployeeDetail />} />
        <Route path='/employee_signup' element={<EmployeeSignup />} />
        
        {/* Employee Dashboard Route with nested routes */}
        <Route path='/employee_dashboard/:id' element={
          <PrivateRoute>
            <EmployeeDashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<EmployeeDetail />} />
          <Route path='mark_attendance' element={<MarkAttendance />} />       
          
        </Route>

        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />} />
          <Route path='/dashboard/employee' element={<Employee />} />
          <Route path='/dashboard/category' element={<Category />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          <Route path='/dashboard/add_category' element={<AddCategory />} />
          <Route path='/dashboard/add_employee' element={<AddEmployee />} />
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />} />
          <Route path='/dashboard/branch' element={<Branch />} />
          <Route path='/dashboard/add_branch' element={<AddBranch />} />
          <Route path='/dashboard/reportattendance' element={<AttendanceReport />} />
          <Route path='/dashboard/user_report' element={<UserReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
