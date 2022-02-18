import {FC} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {LoginPage, Profile, Introduction} from "./pages";
import {useSelector} from "react-redux";
import {RootState} from "./store/store";
import config from "./config/config";

export const App: FC = () => {

  const isAuth = useSelector<RootState>(state => state.auth.isAuth);
  const user = useSelector<RootState>(state => state.auth.user);

  return (
    <>

      <Routes>
        {isAuth ? (
          <Route path="/profile" element={<Profile/>}>
            <Route path="intro" element={<Introduction/>}/>
            {config.pages.map(page => {
              // @ts-ignore
              const isAllow = user.flags.some((flag: { id: number; }) => page.allowed.includes(flag.id));
              if (isAllow){
                return (<Route path={page.link} element={page.component}/>)
              }
              else {return <></>};
            })}
          </Route>
        ) : (
          <Route path="/login" element={<LoginPage />}/>
        )}
        <Route path="*" element={<Navigate to={isAuth ? "/profile/intro" : "/login"}/>}/>
      </Routes>

    </>
  )
}