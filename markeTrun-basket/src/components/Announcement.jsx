import React, { useState, useEffect } from "react";

function Announcement() {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const getNextDeadline = () => {
      const now = new Date();
      const deadline = new Date();

      // 3 = Wednesday (Sunday = 0)
      const today = now.getDay();
      const daysUntilWed = (3 - today + 7) % 7;

      deadline.setDate(now.getDate() + daysUntilWed);
      deadline.setHours(18, 0, 0, 0); // 6PM

      // If today is Wednesday and past 6PM → move to next week
      if (today === 3 && now > deadline) {
        deadline.setDate(deadline.getDate() + 7);
      }

      return deadline;
    };

    const deadline = getNextDeadline();

    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft(0);
        return;
      }

      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

 const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

    

   return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

  return (
    <div className="announcement">
      <div>
        Order before Wednesday 6PM for this week’s delivery <span>{formatTime(timeLeft)}</span>
      </div>
      <div>
        Delivery days: Friday / Saturday
      </div>
    </div>
  );
}

export default Announcement;