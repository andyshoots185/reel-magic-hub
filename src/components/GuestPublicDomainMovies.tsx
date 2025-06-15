
import React, { useState } from "react";

// Handpicked sample of public domain movies with streaming links from Internet Archive
const publicMovies = [
  {
    id: "night_of_the_living_dead",
    title: "Night of the Living Dead (1968)",
    description:
      "A classic horror film in the public domain. Seven people, trapped in a rural farmhouse, must fight off a horde of undead zombies.",
    poster:
      "https://archive.org/services/img/night_of_the_living_dead",
    streamUrl:
      "https://archive.org/embed/night_of_the_living_dead",
  },
  {
    id: "plan_9_from_outer_space_1959",
    title: "Plan 9 from Outer Space (1959)",
    description:
      "Famous cult sci-fi film hailed as 'so bad it's good!' Aliens resurrect the dead to stop humanity.",
    poster:
      "https://archive.org/services/img/plan_9_from_outer_space_1959",
    streamUrl:
      "https://archive.org/embed/plan_9_from_outer_space_1959",
  },
  {
    id: "charlie_chaplin_the_kid",
    title: "Charlie Chaplin's The Kid (1921)",
    description:
      "Chaplin’s heartfelt silent comedy—A tramp cares for an abandoned child.",
    poster:
      "https://archive.org/services/img/ChaplinTheKid",
    streamUrl:
      "https://archive.org/embed/ChaplinTheKid",
  },
  {
    id: "sherlockholmes_arthurwontner",
    title: "The Triumph of Sherlock Holmes (1935)",
    description:
      "Classic British Sherlock Holmes mystery based on 'The Valley of Fear'.",
    poster:
      "https://archive.org/services/img/sherlockholmes_arthurwontner",
    streamUrl:
      "https://archive.org/embed/sherlockholmes_arthurwontner",
  },
];

const GuestPublicDomainMovies = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-12 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
          Stream Free, Classic Public Domain Movies
        </h2>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
          Enjoy hand-picked legendary films that are free to watch forever. No account or fees required. Want the latest blockbusters? Create an account for even more!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publicMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-zinc-800 bg-opacity-80 rounded-lg shadow-lg flex flex-col"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="rounded-t-lg w-full h-60 object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{movie.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{movie.description}</p>
                <button
                  onClick={() => setSelected(movie.id)}
                  className="w-full bg-gradient-to-r from-purple-700 to-blue-600 text-white font-semibold py-2 rounded transition hover:from-pink-700 hover:to-purple-700"
                >
                  {selected === movie.id ? "Close" : "Watch Now"}
                </button>
              </div>
              {selected === movie.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                  <div className="relative w-full max-w-2xl">
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-3 py-1 text-sm hover:bg-black/90"
                    >
                      Close
                    </button>
                    <iframe
                      title={movie.title}
                      src={movie.streamUrl}
                      width="100%"
                      height="480"
                      allowFullScreen
                      className="rounded-lg w-full"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuestPublicDomainMovies;
