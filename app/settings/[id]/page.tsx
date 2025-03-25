'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'

export default function SettingsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      newEmail: '',
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
      isValid = false
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
      isValid = false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    if (
      formData.newEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)
    ) {
      newErrors.newEmail = 'Please enter a valid email address'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          ...(formData.newPassword && { newPassword: formData.newPassword }),
          ...(formData.newEmail && { newEmail: formData.newEmail }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings')
      }

      setSuccessMessage('Settings updated successfully!')
      // Clear sensitive fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))

      // If email was changed, suggest user to verify it
      if (formData.newEmail) {
        setSuccessMessage(
          (prev) => prev + ' Please check your new email for verification.'
        )
      }
    } catch (error) {
      console.error('Update error:', error)
      setErrors((prev) => ({
        ...prev,
        serverError:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-800 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto bg-bgSecondary rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6'>
        <div className='flex items-center mb-6'>
          <button
            onClick={() => router.back()}
            className='mr-4 p-2 rounded-full hover:bg-slate-600'
          >
            <FiArrowLeft className='text-blue-100 text-xl' />
          </button>
          <h1 className='text-2xl font-bold text-blue-100'>Account Settings</h1>
        </div>

        {successMessage && (
          <div className='mb-4 p-4 bg-green-900 text-green-100 rounded'>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Password Change Section */}
          <div className='border-b border-slate-600 pb-6'>
            <h2 className='text-lg font-medium text-blue-100 mb-4'>
              Change Password
            </h2>

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='currentPassword'
                  className='block text-sm font-medium text-blue-100 mb-1'
                >
                  Current Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiLock className='text-slate-400' />
                  </div>
                  <input
                    id='currentPassword'
                    name='currentPassword'
                    type={showPassword.current ? 'text' : 'password'}
                    autoComplete='current-password'
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 bg-slate-600 text-white ${
                      errors.currentPassword
                        ? 'border-red-500'
                        : 'border-slate-500'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('current')}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword.current ? (
                      <FiEyeOff className='text-slate-400 hover:text-blue-100' />
                    ) : (
                      <FiEye className='text-slate-400 hover:text-blue-100' />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className='mt-1 text-sm text-red-400'>
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-sm font-medium text-blue-100 mb-1'
                >
                  New Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiLock className='text-slate-400' />
                  </div>
                  <input
                    id='newPassword'
                    name='newPassword'
                    type={showPassword.new ? 'text' : 'password'}
                    autoComplete='new-password'
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 bg-slate-600 text-white ${
                      errors.newPassword ? 'border-red-500' : 'border-slate-500'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('new')}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword.new ? (
                      <FiEyeOff className='text-slate-400 hover:text-blue-100' />
                    ) : (
                      <FiEye className='text-slate-400 hover:text-blue-100' />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className='mt-1 text-sm text-red-400'>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-blue-100 mb-1'
                >
                  Confirm New Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiLock className='text-slate-400' />
                  </div>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showPassword.confirm ? 'text' : 'password'}
                    autoComplete='new-password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 bg-slate-600 text-white ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-slate-500'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type='button'
                    onClick={() => togglePasswordVisibility('confirm')}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword.confirm ? (
                      <FiEyeOff className='text-slate-400 hover:text-blue-100' />
                    ) : (
                      <FiEye className='text-slate-400 hover:text-blue-100' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-400'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email Change Section */}
          <div className='border-b border-slate-600 pb-6'>
            <h2 className='text-lg font-medium text-blue-100 mb-4'>
              Change Email Address
            </h2>

            <div>
              <label
                htmlFor='newEmail'
                className='block text-sm font-medium text-blue-100 mb-1'
              >
                New Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiMail className='text-slate-400' />
                </div>
                <input
                  id='newEmail'
                  name='newEmail'
                  type='email'
                  autoComplete='email'
                  value={formData.newEmail}
                  onChange={handleChange}
                  className={`block w-full pl-10 py-2 bg-slate-600 text-white ${
                    errors.newEmail ? 'border-red-500' : 'border-slate-500'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {errors.newEmail && (
                <p className='mt-1 text-sm text-red-400'>{errors.newEmail}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 border border-slate-500 rounded-md shadow-sm text-sm font-medium text-blue-100 bg-slate-700 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 '
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
