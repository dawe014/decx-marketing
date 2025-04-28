// src/app/(influencer)/profile-builder/page.jsx
'use client';

import { useState } from 'react';
import { FiCheck, FiArrowRight, FiUser, FiLink, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function ProfileBuilder() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: '',
      username: '',
      bio: '',
      location: ''
    },
    socialMedia: [],
    niches: [],
    rates: {
      postRate: '',
      storyRate: '',
      videoRate: ''
    }
  });

  const steps = [
    { id: 1, name: 'Basic Info', icon: <FiUser /> },
    { id: 2, name: 'Social Profiles', icon: <FiLink /> },
    { id: 3, name: 'Niches', icon: <FiCheckCircle /> },
    { id: 4, name: 'Rates', icon: <FiDollarSign /> },
    { id: 5, name: 'Complete' }
  ];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Submit profile data to API
    try {
      const response = await fetch('/api/influencer/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/influencer/dashboard');
      }
    } catch (error) {
      console.error('Profile submission failed:', error);
    }
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Progress Stepper */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li key={step.id} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  {completedSteps.includes(step.id) || currentStep > step.id ? (
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600">
                      <FiCheck className="w-5 h-5 text-white" />
                    </div>
                  ) : currentStep === step.id ? (
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-500">
                      <span className="text-indigo-500">{step.icon}</span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-slate-500">
                      <span className="text-slate-400">{step.id}</span>
                    </div>
                  )}
                  <div className={`ml-4 text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-slate-400'}`}>
                    {step.name}
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div className="absolute top-0 right-0 h-full w-5 flex items-center justify-center">
                    <div className={`h-full w-px ${currentStep > step.id ? 'bg-indigo-600' : 'bg-slate-700'}`} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 1 && (
          <BasicInfoStep 
            data={formData.basicInfo} 
            updateData={(data) => updateFormData('basicInfo', data)} 
          />
        )}
        {currentStep === 2 && (
          <SocialProfilesStep 
            data={formData.socialMedia} 
            updateData={(data) => updateFormData('socialMedia', data)} 
          />
        )}
        {currentStep === 3 && (
          <NichesStep 
            data={formData.niches} 
            updateData={(data) => updateFormData('niches', data)} 
          />
        )}
        {currentStep === 4 && (
          <RatesStep 
            data={formData.rates} 
            updateData={(data) => updateFormData('rates', data)} 
          />
        )}
        {currentStep === 5 && (
          <CompletionStep formData={formData} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {currentStep > 1 && currentStep < 5 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Back
          </button>
        )}
        {currentStep < 4 && (
          <button
            onClick={handleNext}
            className="ml-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
          >
            Next <FiArrowRight className="ml-2" />
          </button>
        )}
        {currentStep === 4 && (
          <button
            onClick={handleNext}
            className="ml-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
          >
            Complete Profile <FiCheck className="ml-2" />
          </button>
        )}
        {currentStep === 5 && (
          <button
            onClick={handleSubmit}
            className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
          >
            Go to Dashboard <FiArrowRight className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}

// Step Components
function BasicInfoStep({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-400 mb-6">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name*</label>
        <input
          type="text"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Username*</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400">
            @
          </span>
          <input
            type="text"
            name="username"
            value={data.username}
            onChange={handleChange}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-r-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Bio*</label>
        <textarea
          name="bio"
          value={data.bio}
          onChange={handleChange}
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
        <p className="mt-1 text-xs text-slate-400">Tell brands about yourself and your content</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
        <input
          type="text"
          name="location"
          value={data.location}
          onChange={handleChange}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Country, City"
        />
      </div>
    </div>
  );
}

function SocialProfilesStep({ data, updateData }) {
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState('');

  const handleAddProfile = () => {
    if (handle && followers) {
      updateData([...data, { platform, handle, followers: parseInt(followers) }]);
      setHandle('');
      setFollowers('');
    }
  };

  const handleRemoveProfile = (index) => {
    updateData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-400 mb-6">Social Media Profiles</h3>
      
      <div className="bg-slate-700/50 p-4 rounded-lg">
        <div className="grid md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform*</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter/X</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Handle*</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="@username"
            />
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">Followers*</label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={handleAddProfile}
              className="w-full h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center"
            >
              <FiCheck />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((profile, index) => (
          <div key={index} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                {profile.platform === 'instagram' && <span className="text-pink-500">IG</span>}
                {profile.platform === 'youtube' && <span className="text-red-500">YT</span>}
                {profile.platform === 'tiktok' && <span className="text-black dark:text-white">TT</span>}
              </div>
              <div>
                <p className="font-medium">@{profile.handle}</p>
                <p className="text-sm text-slate-400">{profile.followers.toLocaleString()} followers</p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveProfile(index)}
              className="text-slate-400 hover:text-red-400 p-2"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Add at least one social media profile to continue</p>
        </div>
      )}
    </div>
  );
}

function NichesStep({ data, updateData }) {
  const nicheOptions = [
    'Fashion', 'Beauty', 'Fitness', 'Travel', 'Food', 
    'Technology', 'Gaming', 'Parenting', 'Business', 'Lifestyle'
  ];

  const toggleNiche = (niche) => {
    if (data.includes(niche)) {
      updateData(data.filter(n => n !== niche));
    } else {
      updateData([...data, niche]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-400 mb-6">Select Your Niches</h3>
      <p className="text-slate-300 mb-6">Choose 2-5 niches that best represent your content</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {nicheOptions.map((niche) => (
          <button
            key={niche}
            onClick={() => toggleNiche(niche)}
            className={`py-3 px-4 rounded-lg border transition-colors ${data.includes(niche) ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-slate-600 hover:border-slate-500 text-slate-300'}`}
          >
            {niche}
          </button>
        ))}
      </div>
      
      {data.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Selected Niches:</h4>
          <div className="flex flex-wrap gap-2">
            {data.map(niche => (
              <span key={niche} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-400 text-sm">
                {niche}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RatesStep({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-400 mb-6">Set Your Rates</h3>
      <p className="text-slate-300 mb-6">Help brands understand your collaboration pricing</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-700/30 p-5 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">Instagram Post</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-slate-400" />
            </div>
            <input
              type="number"
              name="postRate"
              value={data.postRate}
              onChange={handleChange}
              className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="500"
            />
          </div>
        </div>
        
        <div className="bg-slate-700/30 p-5 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">Instagram Story</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-slate-400" />
            </div>
            <input
              type="number"
              name="storyRate"
              value={data.storyRate}
              onChange={handleChange}
              className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="200"
            />
          </div>
        </div>
        
        <div className="bg-slate-700/30 p-5 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">YouTube Video</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-slate-400" />
            </div>
            <input
              type="number"
              name="videoRate"
              value={data.videoRate}
              onChange={handleChange}
              className="w-full pl-10 bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="1000"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-700/30 p-5 rounded-lg mt-6">
        <h4 className="text-sm font-medium text-slate-300 mb-3">Rate Guidance</h4>
        <ul className="text-sm text-slate-400 space-y-2">
          <li className="flex items-start">
            <FiCheck className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>Consider your audience size, engagement rate, and content quality</span>
          </li>
          <li className="flex items-start">
            <FiCheck className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>You can adjust these rates for each campaign opportunity</span>
          </li>
          <li className="flex items-start">
            <FiCheck className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>Average rates: $100 per 10K followers for posts, $50 for stories</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CompletionStep({ formData }) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
        <FiCheckCircle className="h-6 w-6 text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Profile Complete!</h3>
      <p className="text-slate-300 mb-6">
        Your influencer profile is ready to be discovered by brands
      </p>
      
      <div className="bg-slate-700/30 rounded-lg p-6 max-w-md mx-auto text-left">
        <h4 className="font-medium text-slate-200 mb-3">Preview:</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Name</p>
            <p className="text-white">{formData.basicInfo.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Username</p>
            <p className="text-white">@{formData.basicInfo.username}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Niches</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.niches.map(niche => (
                <span key={niche} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-xs">
                  {niche}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}