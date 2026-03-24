
import { getUsers } from '@/features/users/action';
import { DataTableUser } from './data-table';
  import { columnsUser } from './columns';
import { requiereAdmin } from '@/lib/guards';
import { getAuthUserId } from '@/features/auth/actions';


const UsersPage = async () => {
  await requiereAdmin();
  const userId = await getAuthUserId();
  const users = await getUsers();
  const safeUsers = users.map((user) => ({
    ...user,
  }));

  return (
    <DataTableUser columns={columnsUser} data={safeUsers} currentUserId={userId}  />
  )


}

export default UsersPage