import React from "react";
import GymImage1 from "../../assets/CoverPage/Home.svg";

const services = [
  { type: "text", title: "OUR SERVICES", description: "At Stronger, one size does not fit all! We have a plan for everyone!" },
  { image: GymImage1, title: "PERSONAL TRAINING", description: "Customized workout plans with expert trainers." },
  { image: GymImage1, title: "OUR COACH", description: "" },
  { image: GymImage1, title: "OUR PRODUCTS", description: "" },
  { image: GymImage1, title: "MEDICAL FITNESS", description: "" },
  { image: GymImage1, title: "BODY TRANSFORMATION GALLERY", description: "" },
];

const ServiceCard = ({ image, title, description, type }) => {
  return (
    <div className="relative w-full h-[350px] max-w-[350px] aspect-[1/1] rounded-lg overflow-hidden shadow-lg cursor-pointer flex items-center justify-center bg-white text-center">
      {type === "text" ? (
        // Text-based card for "OUR SERVICES"
        <div className="flex-col text-black p-4">
          <h3 className="flex text-left justify-start text-black text-4xl font-bold">{title}</h3>
          <p className="text-black text-left text-2xl mt-2">{description}</p>
        </div>
      ) : (
        <>
          {/* Image for service cards */}
          <img src={image} alt={title} className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-20" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-80 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-yellow-400 text-lg font-bold">{title}</h3>
            {description && <p className="text-white text-sm mt-2">{description}</p>}
          </div>
        </>
      )}
    </div>
  );
};

const Services = () => {
  return (
    <div className="max-w-screen-xl mx-auto bg-white py-20 px-4 md:px-16">
      {/* Flex Layout for 3 rows and 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {services.map((service, index) => (
          <div key={index} className="w-full flex justify-center">
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
