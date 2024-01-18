import { useAuthContext } from "../../../context/AuthContext";
import { MoonLoader } from "react-spinners";
import { CardDash } from "../components/DashBoard/CardDash";
import { TimeDedicated } from "../components/DashBoard/TimeDedicated";
import "../styles/cardDash.css";


function Dashboard() {
  const { user, isLoading } = useAuthContext();
  document.title = 'Dashboard - Uptitude'

  return (
    <div className="rounded-tl-3xl  bg-[#e7eaf886] w-full">
      {isLoading ? (
        <div className=" flex items-center justify-center w-full h-full">
          <MoonLoader color="#363cd6" size={80} />
        </div>
      ) : (
        <main className="flex flex-wrap w-full h-full justify-center items-center pt-7 ">
          <div className="flex h-[15rem] p-3 min-w-[95%] max-w-[95%] ">
            <CardDash user={user} />
          </div>
          <div className="flex  min-h-[400px] h-[calc(100vh-15rem-10rem)] p-3 min-w-[95%] max-w-[95%]">
            <TimeDedicated courses={user?.courses} />
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;
