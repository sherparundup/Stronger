import React, { useEffect } from "react";
import Layout from "../../components/layout/Layout";
import CoverImage from "../../assets/CoverPage/Home.svg";
import { useAuth } from "../../Context/AuthContext";

const UserDashBoard = () => {
  const [auth, setAuth] = useAuth();
  useEffect(() => {
    console.log(auth);
    console.log(auth.user.name);
  }, []);
  return (
    <Layout>
      <div className="flex-col  h-screen  bg-red-900 min-w-full">
        <div className="flex bg-black">
          <div className="flex-col  w-1/6 h-full   bg-purple-700">
            <div className="flex-col">
              <div className="flex-col">
                <div className="flex justify-center items-center">
                  <img
                    className="w-[100px] h-[100px] rounded-full mt-[50px] object-cover"
                    src={auth.user.image.url}
                    alt="Profile"
                  />
                </div>
                <div className="flex justify-center">{auth.user.name}</div>
              </div>
            </div>
          </div>
          <div className="flex-col  w-5/6 h-full  bg-purple-900">ok</div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashBoard;
