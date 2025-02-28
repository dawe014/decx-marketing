// app/page.js
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import heroImage from "@/public/enfluence1.jpg";
import HowweareImage from "@/public/influence3.png";
import {
  FaCheck,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="mx-auto  max-w-7xl py-6 px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-2 items-center justify-start">
            <div className="flex flex-col gap-5 w-full md:w-1/2">
              <h1 className="text-5xl font-bold capitalize">
                find & hire perfect influencer for your brand
              </h1>
              <p className="capitalize text-secondary">
                Get perfect influencer for your brand with more less time get
                the best influencer.
              </p>
              <div className="flex gap-3 items-center justify-center md:justify-start">
                <Button bgColor="bg-primary" textColor="text-white">
                  Get Started
                </Button>
                <Link className="text-primary font-bold" href="/how-it-works">
                  {" "}
                  How It Works?
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative shadow-md rounded-lg">
              <Image src={heroImage} alt="Hero image" />
            </div>
          </div>
        </div>
      </section>
      <section className="">
        <div className="mx-auto  max-w-7xl py-6 px-6 lg:px-8 mb-6">
          <div className="mt-12 mb-12 p-4 grid grid-cols-3 md:grid-cols-6 gap-5 w-full  items-center justify-center">
            <div className="flex flex-col gap-1 shadow-md items-center justify-center">
              <FaYoutube size={32} className=" bg-white text-red-500" />
              <p className="font-bold text-xl text-secondary">
                7M+ <br />{" "}
                <span className="text-secondary font-light text-sm">
                  Followers
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1 shadow-md items-center justify-center ">
              <FaTiktok size={32} className=" bg-white text-black" />
              <p className="font-bold text-xl text-secondary">
                4M+ <br />{" "}
                <span className="text-secondary font-light text-sm">
                  Followers
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1 shadow-md items-center justify-center ">
              <FaInstagram size={32} className=" bg-white text-pink-500" />
              <p className="font-bold text-xl text-secondary">
                6M+ <br />{" "}
                <span className="text-secondary font-light text-sm">
                  Followers
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1 shadow-md items-center justify-center ">
              <FaLinkedin size={32} className=" bg-white text-primary" />
              <p className="font-bold text-xl text-secondary">
                3M+ <br />{" "}
                <span className="text-secondary font-light text-sm">
                  Followers
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1 shadow-md items-center justify-center ">
              <FaFacebook size={32} className=" bg-white text-blue-400" />
              <p className="font-bold text-xl text-secondary">
                2M+ <br />{" "}
                <span className="text-secondary font-light text-sm">
                  Followers
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1 shadow-md items-center justify-center ">
              <FaTwitter size={32} className=" bg-white text-primary" />
              <p className="font-bold text-xl text-secondary">
                5M+ <br />{" "}
                <span className="text-secondary font-light text-sm">
                  Followers
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-start py-5">
            <div className="w-full md:w-1/2 relative shadow-md rounded-lg">
              <Image src={HowweareImage} alt="Hero image" />
            </div>
            <div className="flex flex-col gap-5 w-full md:w-1/2">
              <p className="text-primary text-md font-light italic font-mono">
                Who We Are?
              </p>
              <h1 className="text-3xl font-bold capitalize">
                empowering connections in the influencer landscape
              </h1>
              <p className=" text-secondary">
                At Brand<span className="text-primary">Boost</span>, We connect
                influencers with brand owners, fostering authentic
                collaborations that drive success. Our platform empowers
                influencers to showcase their talent while helping brands
                discover the perfect voices to represent them.
              </p>
              <p className="text-center text-xl text-primary font-bold">
                Key Highlights
              </p>
              <div className="grid grid-cols-2 gap-2 items-center justify-center md:justify-start">
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Influencer Profile</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Prand Discovery</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Seamless Communication</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Flexible Collaboration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
