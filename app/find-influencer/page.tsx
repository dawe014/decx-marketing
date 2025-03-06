import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

const influencers = [
  {
    name: "John Mallow",
    location: "Los Angeles, USA",
    tags: ["Cooking", "Fashion", "Nice pictures"],
    facebook: "429k",
    twitter: "2m",
    followers: "958k",
  },
  {
    name: "Cheryl Collins",
    location: "Ottawa, Canada",
    tags: ["Cooking", "Travel", "Nice pictures"],
    facebook: "429k",
    twitter: "2m",
    followers: "958k",
  },
  {
    name: "John Mallow",
    location: "Los Angeles, USA",
    tags: ["Cooking", "Fashion", "Nice pictures"],
    facebook: "429k",
    twitter: "2m",
    followers: "958k",
  },
  {
    name: "Cheryl Collins",
    location: "Ottawa, Canada",
    tags: ["Cooking", "Travel", "Nice pictures"],
    facebook: "429k",
    twitter: "2m",
    followers: "958k",
  },
  {
    name: "Paulina Kazimierczak",
    location: "Warsaw, Poland",
    tags: ["Cooking", "Fashion", "Nice pictures"],
    facebook: "429k",
    twitter: "2m",
    followers: "958k",
  },
];

export default function InfluencersPage() {
  return (
    <>
      <section className="bg-primary-light py-6">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 p-6 bg-primary-light items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Name"
                className="px-4 py-2 pr-10 rounded-full border outline-muted"
              />
              <button className="absolute right-2 top-0 translate-y-1/2 text-gray-500">
                ✕
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                className="px-4 py-2 pr-10 rounded-full border outline-muted"
              />
              <button className="absolute right-2 top-0 translate-y-1/2 text-gray-500">
                ✕
              </button>
            </div>
            <Button textColor="text-white" bgColor="bg-primary">
              Search
            </Button>
          </div>
        </div>
      </section>
      {/* lists */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="w-full bg-greay-100 px-3 py-6 shadow">
            <div className=" mx-auto">
              <h1 className="text-3xl font-bold mb-6">Influencers</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3  gap-y-6">
                {influencers.map((influencer, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-2xl p-4"
                  >
                    <Link href={`/find-influencer/id`}>
                      <div className="flex flex-col items-center">
                        <div className=" mb-4">
                          <Image
                            width={500}
                            height={500}
                            src="/profile/pic.png"
                            alt="Influencer Profile"
                            style={{ objectFit: "cover" }}
                            className="w-32 h-32 rounded-full"
                          />
                        </div>
                        <h2 className="text-lg font-semibold">
                          {influencer.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {influencer.location}
                        </p>
                        <div className="flex flex-wrap justify-center mt-3 gap-2">
                          {influencer.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between w-full mt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span>📘</span>
                            {influencer.facebook}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📘</span>
                            {influencer.facebook}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📘</span>
                            {influencer.facebook}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🐦</span>
                            {influencer.twitter}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👥</span>
                            {influencer.followers}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
