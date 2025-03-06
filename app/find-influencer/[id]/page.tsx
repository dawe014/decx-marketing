import Image from "next/image";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default async function page() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8">
      {/* <!-- Profile Header --> */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-6">
        <Image
          width={500}
          height={500}
          src="/profile/pic.png"
          alt="Influencer Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-600">
            <FaLocationDot className="text-primary inline" /> New York, USA
          </p>
          <p className="text-green-600 font-medium">Available for work</p>
        </div>
        <div className="hidden md:block ml-auto">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
            Hire Influencer
          </button>
        </div>
      </div>

      {/* <!-- Bio --> */}
      <div className="bg-white border-b rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-2">About</h3>
        <p className="text-gray-700">
          Hi, I&apos;m John, a lifestyle influencer with over 100K followers
          across Instagram and TikTok. I specialize in creating engaging video
          content and product reviews for brands looking to reach a young,
          vibrant audience.
        </p>
      </div>

      {/* <!-- Social Media Links --> */}
      <div className="bg-white border-b  rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Social Media</h3>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-primary hover:underline flex gap-2 items-center justify-center"
          >
            <FaInstagram className="text-pink-500" /> Instagram
          </a>
          <a
            href="#"
            className="text-primary hover:underline flex gap-2 items-center justify-center"
          >
            <FaTiktok className="text-secondary" />
            TikTok
          </a>
          <a
            href="#"
            className="text-primary hover:underline flex gap-2 items-center justify-center"
          >
            <FaYoutube className="text-red-400" />
            YouTube
          </a>
        </div>
      </div>

      {/* <!-- Services & Pricing --> */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Services & Pricing</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Instagram Post (1 Image + Caption)</span>
            <span className="font-semibold">$150</span>
          </li>
          <li className="flex justify-between">
            <span>Instagram Reel (Up to 60 sec)</span>
            <span className="font-semibold">$250</span>
          </li>
          <li className="flex justify-between">
            <span>TikTok Video (Up to 90 sec)</span>
            <span className="font-semibold">$300</span>
          </li>
        </ul>
      </div>
      {/* <!-- Portfolio --> */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* <!-- Portfolio Item 1 --> */}
          <div className="relative group w-full h-48">
            <Image
              fill
              src="/profile/profile.png"
              alt="Project 1"
              className="rounded-xl object-cover "
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold">Fashion Brand Collab</p>
            </div>
          </div>

          {/* <!-- Portfolio Item 2 --> */}
          <div className="relative group w-full h-48">
            <Image
              fill
              src="/profile/profile2.png"
              alt="Project 2"
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold">Product Review Reel</p>
            </div>
          </div>

          {/* <!-- Portfolio Item 3 --> */}
          <div className="relative group w-full h-48">
            <Image
              fill
              src="/profile/profile3.png"
              alt="Project 3"
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold">Event Promotion</p>
            </div>
          </div>

          {/* <!-- Portfolio Item 4 --> */}
          <div className="relative group w-full h-48">
            <Image
              fill
              src="/profile/profile4.png"
              alt="Project 4"
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold">Travel Vlog Series</p>
            </div>
          </div>

          {/* <!-- Portfolio Item 5 --> */}
          <div className="relative group w-full h-48">
            <Image
              fill
              src="/profile/profile5.png"
              alt="Project 5"
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold">Food Campaign</p>
            </div>
          </div>

          {/* <!-- Portfolio Item 6 --> */}
          <div className="relative group w-full h-48">
            <Image
              fill
              src="/profile/profile6.png"
              alt="Project 6"
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold">Tech Unboxing Video</p>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Reviews --> */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium">⭐️⭐️⭐️⭐️⭐️ by BrandCo</p>
            <p className="text-gray-700">
              John was amazing to work with! The video he created boosted our
              engagement significantly.
            </p>
          </div>
          <div>
            <p className="font-medium">⭐️⭐️⭐️⭐️⭐️ by FreshSnacks</p>
            <p className="text-gray-700">
              Highly professional and creative content. We&apos;ll definitely
              work with John again.
            </p>
          </div>
        </div>
      </div>

      {/* <!-- Contact / Hire Button (Sticky) --> */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-700">
          Contact & Hire
        </button>
      </div>
    </section>
  );
}
