// app/page.js
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col items-center justify-center'>
      {/* Hero Section */}
      <div className='relative w-full h-96'>
        <Image
          src='/about-hero.jpg'
          alt='Hero Image'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
          <h1 className='text-5xl font-bold text-white mb-4'>
            Welcome to Famous People Followers
          </h1>
          <p className='text-lg text-gray-200 mb-6'>
            Discover influential individuals and connect with them for
            advertising opportunities.
          </p>
          <Link
            href='/about'
            className='bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition duration-300'
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  )
}
