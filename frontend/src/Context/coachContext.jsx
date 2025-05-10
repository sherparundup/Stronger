import { createContext, useContext, useEffect, useState } from "react";

// 1. Create the context
const CoachContext = createContext();

// 2. Define the Provider properly (capitalized name)
const CoachContextProvider = ({ children }) => {
  const [coach, setCoach] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("Coach");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setCoach(parsed);
      } catch (err) {
        console.error("Failed to parse Coach from localStorage", err);
      }
    }
  }, []);

  return (
    <CoachContext.Provider value={[coach, setCoach]}>
      {children}
    </CoachContext.Provider>
  );
};

// 3. Custom hook to use the context
const useCoachContext = () => useContext(CoachContext);

// 4. Export both
export { CoachContextProvider, useCoachContext };
