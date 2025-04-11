import React from "react";
import GymImage1 from "../../assets/CoverPage/Home.svg";
import GymImage2 from "../../assets/coachImages/coach1.jpg";
import GymImage3 from "../../assets/Suplement/Protein-Supplements-scaled.jpeg";
import GymImage4 from "../../assets/CoverPage/photo-1534438327276-14e5300c3a48.jfif";
import GymImage5 from "../../assets/CoverPage/AdobeStock_1009639778_Preview.jpeg";

const services = [
  { type: "text", title: "OUR SERVICES", description: "At Stronger, one size does not fit all! We have a plan for everyone!", span: "col-span-2 row-span-1" },
  { image: GymImage1, title: "PERSONAL TRAINING", description: "Customized workout plans with expert trainers.", span: "col-span-1 row-span-1" },
  { image: GymImage2, title: "OUR COACH", description: "Meet our certified coaches dedicated to helping you grow stronger every day.", span: "col-span-1 row-span-2" },
  { image: GymImage3, title: "OUR PRODUCTS", description: "High-quality fitness gear and supplements tailored for performance.", span: "col-span-1 row-span-1" },
  { image: GymImage4, title: "MEDICAL FITNESS", description: "Programs designed for recovery and rehabilitation with expert support.", span: "col-span-1 row-span-2" },
  { image: GymImage5, title: "BODY TRANSFORMATION GALLERY", description: "Real transformations from real people who committed to change.", span: "col-span-1 row-span-1" },
];

const ServiceCard = ({ image, title, description, type, span }) => {
  return (
    <div className={`relative h-full w-full rounded-2xl overflow-hidden shadow-xl bg-white group transition-transform duration-300 hover:scale-[1.02] ${span}`}>
      {type === "text" ? (
        <div className="flex flex-col justify-center items-center h-full  text-black p-6">
          <h3 className="text-3xl font-extrabold mb-3">{title}</h3>
          <p className="text-lg font-medium text-center">{description}</p>
        </div>
      ) : (
        <>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-20"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
            <h3 className="text-black text-2xl font-bold">{title}</h3>
            <p className="text-white text-sm mt-3">{description}</p>
            <button className="mt-4 bg-white text-black px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition-all duration-200">
              Learn More
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Services = () => {
  return (
    <div className="max-w-screen-xl mx-auto py-20 px-4 md:px-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-black tracking-wide">What We Offer</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[220px] gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
