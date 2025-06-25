import { api } from "@/lib/axios"

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const {data} = await api.get(`/users/${id}`)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="font-bold text-5xl">User Details</h1>
      <h1 className="font-light text-2xl italic">{data.user.fullName}</h1>
    </div>
  )
}