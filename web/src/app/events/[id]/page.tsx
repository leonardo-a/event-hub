export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="font-bold text-5xl">Event Details</h1>
      <h1 className="font-light text-2xl italic">{id}</h1>
    </div>
  )
}