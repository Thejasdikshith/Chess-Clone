import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className=" flex justify-center items-center min-h-48 bg-slate-900 p-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img src={"/chessboard.png"} className="min-w-98 " />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              Play chess online on the #2 Site!
            </h1>
            <div className="mt-4">
              <Button
                onClick={() => {
                  navigate("/game");
                }}
              >
                Play Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Landing;
