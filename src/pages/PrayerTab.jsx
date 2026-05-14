import React, { useState } from 'react'
import PrayerInput from '../components/PrayerInput'
import PrayerSession from '../components/PrayerSession'

export default function PrayerTab() {
  const [prayerData,  setPrayerData]  = useState(null)
  const [isLoading,   setIsLoading]   = useState(false)
  const [sessionOpen, setSessionOpen] = useState(false)

  const handlePrayerSubmit = async (data) => {
    setIsLoading(true)
    // Small delay for UX feel
    setTimeout(() => {
      setIsLoading(false)
      setPrayerData(data)
      setSessionOpen(true)
    }, 600)
  }

  const handleSessionClose = () => {
    setSessionOpen(false)
    setPrayerData(null)
  }

  if (sessionOpen && prayerData) {
    return (
      <PrayerSession
        prayerData={prayerData}
        onClose={handleSessionClose}
      />
    )
  }

  return (
    <PrayerInput
      onSubmit={handlePrayerSubmit}
      isLoading={isLoading}
    />
  )
}