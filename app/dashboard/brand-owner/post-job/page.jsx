'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiDollarSign, FiClock, FiCheck, FiX, FiBarChart2, FiUser, FiPlus, FiInfo, FiUpload } from 'react-icons/fi'
import Link from 'next/link'
import CreatableSelect from 'react-select/creatable'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Niche options
const nicheOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Fitness', label: 'Health & Fitness' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Food', label: 'Food & Beverage' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Finance', label: 'Finance' }
]

// Platform options
const platformOptions = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'LinkedIn', label: 'LinkedIn' }
]

export default function NewJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    niche: '',
    language: 'English',
    location: 'Worldwide',
    minBudget: '',
    maxBudget: '',
    duration: '',
    platforms: [],
    engagementReq: '',
    description: '',
    contentReq: '',
    deliverables: [''],
    perks: [''],
    startDate: null,
    endDate: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState('')

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle array field changes
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
    // Clear error when user types
    if (errors[field] && errors[field][index]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        newErrors[field][index] = ''
        return newErrors
      })
    }
  }

  // Add new field to array
  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  // Remove field from array
  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  // Handle select changes
  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle multi-select changes
  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map(opt => opt.value) : []
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
      isValid = false
    }

    if (!formData.niche) {
      newErrors.niche = 'Niche is required'
      isValid = false
    }

    if (!formData.minBudget) {
      newErrors.minBudget = 'Minimum budget is required'
      isValid = false
    } else if (isNaN(formData.minBudget)) {
      newErrors.minBudget = 'Must be a valid number'
      isValid = false
    }

    if (!formData.maxBudget) {
      newErrors.maxBudget = 'Maximum budget is required'
      isValid = false
    } else if (isNaN(formData.maxBudget)) {
      newErrors.maxBudget = 'Must be a valid number'
      isValid = false
    } else if (parseFloat(formData.maxBudget) < parseFloat(formData.minBudget)) {
      newErrors.maxBudget = 'Max budget must be greater than min budget'
      isValid = false
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required'
      isValid = false
    }

    if (!formData.platforms || formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform is required'
      isValid = false
    }

    if (!formData.description) {
      newErrors.description = 'Description is required'
      isValid = false
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
      isValid = false
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
      isValid = false
    } else if (new Date(formData.startDate) < new Date()) {
      newErrors.startDate = 'Start date must be in the future'
      isValid = false
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
      isValid = false
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date'
      isValid = false
    }

    // Deliverables validation
    const deliverablesErrors = []
    let hasDeliverableError = false
    formData.deliverables.forEach((deliverable, index) => {
      if (!deliverable.trim()) {
        deliverablesErrors[index] = 'Deliverable cannot be empty'
        hasDeliverableError = true
      }
    })
    if (hasDeliverableError) {
      newErrors.deliverables = deliverablesErrors
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('jobData', JSON.stringify(formData))
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage('Campaign created successfully!')
        router.push(`/brand/jobs/${result.id}`)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || 'Failed to create campaign')
      }
    } catch (err) {
      console.error('Error creating campaign:', err)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/brand/jobs" className="flex items-center text-indigo-400 hover:text-indigo-300">
            <FiX className="mr-2" size={20} />
            <span>Back to Jobs</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create New Campaign</h1>
          <div className="w-8"></div>
        </div>

        {/* Status messages */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            {successMessage}
          </div>
        )}

        {/* Job Post Form */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Campaign Image */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">Campaign Image</h3>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="relative aspect-square bg-slate-700 rounded-lg overflow-hidden border-2 border-dashed border-slate-600">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Campaign preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <FiInfo size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload Campaign Image (Optional)
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Add an image that represents your campaign. This will help creators visualize your brand.
                    </p>
                    <label className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
                      <FiUpload className="mr-2" />
                      <span>Choose File</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-slate-400">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Campaign Title*
                      {errors.title && (
                        <span className="ml-2 text-red-400 text-xs">{errors.title}</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full bg-slate-700 border ${errors.title ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="e.g. Summer Collection Promotion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Niche*
                      {errors.niche && (
                        <span className="ml-2 text-red-400 text-xs">{errors.niche}</span>
                      )}
                    </label>
                    <CreatableSelect
                      options={nicheOptions}
                      className="text-sm text-slate-900"
                      classNamePrefix="select"
                      isClearable
                      onChange={(selected) => handleSelectChange('niche', selected)}
                      value={nicheOptions.find(opt => opt.value === formData.niche) || null}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Language*
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Location*
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. Worldwide, US Only, Europe"
                    />
                  </div>
                </div>
              </div>

              {/* Campaign Dates */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">Campaign Timeline</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Date*
                      {errors.startDate && (
                        <span className="ml-2 text-red-400 text-xs">{errors.startDate}</span>
                      )}
                    </label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => handleDateChange('startDate', date)}
                      minDate={new Date()}
                      className={`w-full bg-slate-700 border ${errors.startDate ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholderText="Select start date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Date*
                      {errors.endDate && (
                        <span className="ml-2 text-red-400 text-xs">{errors.endDate}</span>
                      )}
                    </label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) => handleDateChange('endDate', date)}
                      minDate={formData.startDate || new Date()}
                      className={`w-full bg-slate-700 border ${errors.endDate ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholderText="Select end date"
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Duration */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">Budget & Duration</h3>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Min Budget ($)*
                      {errors.minBudget && (
                        <span className="ml-2 text-red-400 text-xs">{errors.minBudget}</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="minBudget"
                        value={formData.minBudget}
                        onChange={handleChange}
                        className={`w-full pl-10 bg-slate-700 border ${errors.minBudget ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Budget ($)*
                      {errors.maxBudget && (
                        <span className="ml-2 text-red-400 text-xs">{errors.maxBudget}</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="maxBudget"
                        value={formData.maxBudget}
                        onChange={handleChange}
                        className={`w-full pl-10 bg-slate-700 border ${errors.maxBudget ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="1000"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Duration*
                      {errors.duration && (
                        <span className="ml-2 text-red-400 text-xs">{errors.duration}</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`w-full pl-10 bg-slate-700 border ${errors.duration ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="e.g. 1 month, 2 weeks"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <h3 className="font-medium mb-5 text-lg text-indigo-400">Campaign Details</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description*
                      {errors.description && (
                        <span className="ml-2 text-red-400 text-xs">{errors.description}</span>
                      )}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full bg-slate-700 border ${errors.description ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="Describe the campaign goals, target audience, and any other important details..."
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      {formData.description.length}/500 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Platforms*
                      {errors.platforms && (
                        <span className="ml-2 text-red-400 text-xs">{errors.platforms}</span>
                      )}
                    </label>
                    <CreatableSelect
                      isMulti
                      options={platformOptions}
                      className="text-sm text-slate-900"
                      classNamePrefix="select"
                      onChange={(selected) => handleMultiSelectChange('platforms', selected)}
                      value={platformOptions.filter(opt => 
                        formData.platforms.includes(opt.value)
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Engagement Requirement
                    </label>
                    <input
                      type="text"
                      name="engagementReq"
                      value={formData.engagementReq}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. 5-7% engagement rate, 10k+ followers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Content Requirements
                    </label>
                    <textarea
                      name="contentReq"
                      value={formData.contentReq}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Specify any content requirements (e.g. must show product, include hashtags, specific messaging, etc.)"
                    />
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">
                    Deliverables*
                    {errors.deliverables && (
                      <span className="ml-2 text-red-400 text-sm font-normal">At least one deliverable is required</span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={() => addArrayField('deliverables')}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.deliverables.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange('deliverables', index, e.target.value)}
                        className={`flex-1 bg-slate-700 border ${errors.deliverables?.[index] ? 'border-red-500' : 'border-slate-600'} rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="e.g. 3 Instagram posts, 1 Reel, 5 Stories"
                      />
                      {formData.deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('deliverables', index)}
                          className="ml-2 text-slate-400 hover:text-red-400 p-2"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="bg-slate-700/30 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-medium text-lg text-indigo-400">Perks & Benefits</h3>
                  <button
                    type="button"
                    onClick={() => addArrayField('perks')}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.perks.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange('perks', index, e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Free product samples, Exclusive discounts, Early access"
                      />
                      {formData.perks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('perks', index)}
                          className="ml-2 text-slate-400 hover:text-red-400 p-2"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href="/brand/jobs"
                  className="px-6 py-3 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Posting...'
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Post Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}