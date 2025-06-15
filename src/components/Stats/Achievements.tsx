
import React from "react";
const Achievements = () => {
  // Placeholder for badges/ranks
  return (
    <section>
      <div className="font-bold text-white mb-2">Achievements</div>
      <div className="flex gap-2">
        <span className="bg-yellow-400 rounded px-2 py-1 text-black">🏆 Binge King</span>
        <span className="bg-blue-400 rounded px-2 py-1 text-black">👑 Reviewer</span>
      </div>
      <div className="text-gray-400 text-xs mt-2">Watch and rate more to unlock badges!</div>
    </section>
  );
};
export default Achievements;
