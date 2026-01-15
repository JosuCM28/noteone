import Dashboard from '@/features/dashboard/pages/Dashboard';
import { MOCK_ESCRITURAS } from '@/features/shared/data/mock-data';


const DashboardPage = () => {
  
  return (
    <Dashboard escrituras={MOCK_ESCRITURAS} />
  )


}

export default DashboardPage