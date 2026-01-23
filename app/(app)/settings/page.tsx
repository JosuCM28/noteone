import React from 'react'
import TaxSettings from '@/features/settings/TaxSettings'
import { getTaxes } from '@/features/escrituras/actions';


const SettingsPage = async () => {
  const taxes = await getTaxes();
  const taxesUI = taxes.map((t) => ({ ...t, value: Number(t.value) }));
  return (
    <TaxSettings taxes={taxesUI} />
  )
}

export default SettingsPage