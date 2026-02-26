import React from 'react'
import TaxSettings from '@/features/settings/TaxSettings'
import { getTaxes } from '@/features/settings/action'


const SettingsPage = async () => {
  const taxes = await getTaxes();

  console.log(taxes);
  return (
    <TaxSettings taxes={taxes} />
  )
}

export default SettingsPage