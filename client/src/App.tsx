import {FC} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {LoginPage, Profile, Introduction, RegistrationPage} from "./pages";
import {useSelector} from "react-redux";
import {RootState} from "./store/store";
import config from "./config/config";
import {User} from "./store/actions/authActions";
import {AnimatePresence} from "framer-motion";
import { useLocation } from 'react-router-dom';

export const App: FC = () => {

  const location = useLocation();

  const isAuth = useSelector<RootState>(state => state.auth.isAuth);
  const user = useSelector<RootState>(state => state.auth.user) as User;

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Routes location={location} key={location.pathname}>
        {isAuth ? (
          <Route path="/profile" element={<Profile/>}>
            <Route path="intro" element={<Introduction/>}/>
            {config.pages.map(page => {
              const isAllow = user.flags.some((flag: { id: number; }) => page.allowed.includes(flag.id));
              if (isAllow){
                return (<Route path={page.link} element={page.component}/>)
              }
              else {return <></>};
            })}
          </Route>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/registration" element={<RegistrationPage />}/>
          </>
        )}
        <Route path="*" element={<Navigate to={isAuth ? "/profile/intro" : "/login"}/>}/>
      </Routes>
    </AnimatePresence>
  )
}