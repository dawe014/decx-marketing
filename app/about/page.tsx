// app/about/page.js
import Image from 'next/image'

export default function About() {
  return (
    <div className='bg-gray-50'>
      {/* Hero Section */}
      <div className='relative h-96'>
        <Image
          src='/about-hero.jpg'
          alt='About Us Hero'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <h1 className='text-5xl font-bold text-white text-center'>
            About Us
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {/* Mission Section */}
        <section className='flex flex-col md:flex-row items-center gap-8 mb-12'>
          <div className='w-24 h-24 flex items-center justify-center bg-blue-100 rounded-full'>
            <Image
              src='/icon-mission.png'
              alt='Mission Icon'
              width={48}
              height={48}
            />
          </div>
          <div className='flex-1'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              Our Mission
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              Our mission is to provide a comprehensive database of famous
              individuals with 5,000 or more subscribers on social media. We aim
              to make it easier for businesses to find the right influencers for
              their advertising campaigns.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className='flex flex-col md:flex-row items-center gap-8 mb-12'>
          <div className='w-24 h-24 flex items-center justify-center bg-green-100 rounded-full'>
            <Image
              src='/icon-features.png'
              alt='Features Icon'
              width={48}
              height={48}
            />
          </div>
          <div className='flex-1'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>Features</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>
                View detailed profiles of famous individuals, including their
                social media followers and engagement metrics.
              </li>
              <li>
                Register as a famous person if you have 5,000 or more
                subscribers on any social media platform.
              </li>
              <li>
                Connect with companies and advertisers looking for influencers.
              </li>
            </ul>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className='flex flex-col md:flex-row items-center gap-8 mb-12'>
          <div className='w-24 h-24 flex items-center justify-center bg-purple-100 rounded-full'>
            <Image
              src='/icon-why-choose-us.png'
              alt='Why Choose Us Icon'
              width={48}
              height={48}
            />
          </div>
          <div className='flex-1'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              Why Choose Us?
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              We provide a user-friendly interface, accurate data, and a secure
              platform for both influencers and advertisers. Our goal is to
              bridge the gap between talent and opportunity.
            </p>
          </div>
        </section>
      </div>

      {/* Call to Action Section */}
      <div className='bg-blue-600 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>
            Ready to Get Started?
          </h2>
          <p className='text-gray-200 mb-6'>
            Join our platform today and connect with the best influencers or
            advertise your brand effectively.
          </p>
          <button className='bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition duration-300'>
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  )
}
