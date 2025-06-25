import Link from 'next/link'
import { z } from 'zod'
import { api } from '@/lib/axios'

export default async function Users() {
  const { data } = await api.get(`/users`, {
    params: {
      page: 1,
    },
  })

  const schema = z.object({
    users: z.array(
      z.object({
        id: z.string().uuid(),
        fullName: z.string(),
        email: z.string().email(),
        role: z.enum(['ADMIN', 'USER']),
      })
    ),
  })

  const { users } = schema.parse(data)

  console.log(users)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="font-bold text-5xl">Users</h1>
      <div className="border-2 rounded-xl p-2">
        {users.map(user => (
          <Link
            href={`/users/${user.id}`}
            key={`user-${user.id}`}
            className="hover:bg-lime-400/30"
          >
            <p className="font-bold">{user.fullName}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
