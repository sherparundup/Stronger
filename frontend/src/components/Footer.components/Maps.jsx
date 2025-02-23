import React from "react";

const Map = () => {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14127.187389746368!2d85.34704788642246!3d27.723558068767577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b67842f5005%3A0x39c0126cbf14d365!2sLIFETIME%20GYM%20%26%20FITNESS!5e0!3m2!1sen!2snp!4v1739601452977!5m2!1sen!2snp"
        width="100%"
        height="100%"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
