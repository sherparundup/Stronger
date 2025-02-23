import React from "react";
import mapsIcon from "../../assets/ContactPageIcons/mapsIcon.svg";
import callIcon from "../../assets/ContactPageIcons/callIcon.svg";
import MessageIcon from "../../assets/ContactPageIcons/MessageIcon.svg";
import pathao from "../../assets/ContactPageIcons/pathao.svg";
import indrive from "../../assets/ContactPageIcons/indrive.svg";
import Maps from "./Maps.jsx"

const Contact = () => {
  return (
    <div className="flex flex-col pt-[100px] pb-[100px] bg-black">
      <div className="flex justify-center text-amber-300 pb-[100px] text-4xl sm:text-6xl md:text-7xl">
        Contact
      </div>

      <div className="flex justify-center ">
        <div className="flex flex-col sm:flex-row justify-around gap-5 w-full sm:w-[1220px]">

          <div className="w-full sm:w-[600px] px-4">
           
            <div className="text-3xl sm:text-4xl text-amber-300 pb-[30px]">
              Where are we?
            </div>
            <div className="text-xl sm:text-2xl h-fit pb-[20px] flex text-white">
              <div className="flex justify-center items-center pr-[10px]">
                <img src={mapsIcon} alt="Map Icon" className="w-6" />
              </div>
              <div>Tinchuli, Kathmandu</div>
            </div>
            <div className="text-xl sm:text-2xl h-fit pb-[20px] flex text-white">
              <div className="flex justify-center items-center pr-[10px]">
                <img src={callIcon} alt="Call Icon" className="w-6" />
              </div>
              <div>+9979816011358 | 9816011358</div>
            </div>
            <div className="text-xl sm:text-2xl h-fit flex text-white">
              <div className="flex justify-center items-center pr-[10px]">
                <img src={MessageIcon} alt="Message Icon" className="w-6" />
              </div>
              <div>lifetime@tinchuli</div>
            </div>

            <div className="text-3xl sm:text-4xl pt-[90px] text-amber-300 pb-[30px]">
              How to get here?
            </div>
            <div className="flex flex-wrap justify-between gap-5">
              <div className="flex gap-x-2 items-center">
                <img className="w-[20px]" src={mapsIcon} alt="Map Icon" />
                <div className="text-xl sm:text-2xl text-white">Maps</div>
              </div>
              <div className="flex gap-x-2 items-center">
                <img className="w-[20px]" src={pathao} alt="Pathao Icon" />
                <div className="text-xl sm:text-2xl text-white">Pathao</div>
              </div>
              <div className="flex gap-x-2 items-center">
                <img className="w-[20px]" src={indrive} alt="Indrive Icon" />
                <div className="text-xl sm:text-2xl text-white">Indrive</div>
              </div>
            </div>
          </div>

          <div  className="flex w-full h-[400px]  justify-end  sm:w-[600px] md:w-full     text-center text-white">
            <div className="w-4/5 h-full   flex    text-2xl"><Maps/></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
