import React, { useState } from "react";
import add from "../../assets/Faq/add.svg";
import minus from "../../assets/Faq/minus.svg";

const faqs = [
  { question: "Do you offer personal training sessions?", answer: "Yes, we have certified trainers available for personalized training sessions tailored to your fitness goals." },
  { question: "What are your gym hours?", answer: "We are open 24/7 to fit your schedule, so you can work out at any time that suits you best." },
  { question: "Do you have nutrition plans available?", answer: "Yes, we offer customized nutrition plans designed by our professional dietitians." },
  { question: "Is there a trial period available?", answer: "Absolutely! We offer a 7-day free trial for new members to explore our facilities and classes." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-black flex-col pb-[100px]">
      <div className="text-7xl pt-[50px] flex justify-center text-amber-300 pb-[80px]">
        FAQs
      </div>
      <div className="flex-col">
        {faqs.map((faq, index) => (
          <div key={index} className="flex justify-center pb-[20px]">
            <div
              className="pl-[20px] bg-[#0f1217] flex flex-col items-start h-auto rounded-[4px] w-full sm:w-[1000px] p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="text-white text-2xl">{faq.question}</div>
                <img src={openIndex === index ? minus : add} alt="toggle" />
              </div>
              {openIndex === index && (
                <div className="text-white text-lg mt-2">{faq.answer}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
