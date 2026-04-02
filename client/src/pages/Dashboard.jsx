export default function Dashboard({ registered }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      
      <h1 className="text-3xl md:text-4xl mb-6">
        My Registered Events 🎟️
      </h1>

      {registered.length === 0 ? (
        <p>No events registered yet.</p>
      ) : (
        <div className="grid gap-6">
          {registered.map((event, index) => (
            <div
              key={index}
              className="bg-white/10 p-5 rounded-xl border border-white/20"
            >
              <h2 className="text-xl font-bold">{event.title}</h2>

              <p className="text-gray-300 mt-2">
                {event.description}
              </p>

              <div className="mt-3 text-sm text-gray-400">
                <p><b>Name:</b> {event.user.name}</p>
                <p><b>Email:</b> {event.user.email}</p>
                <p><b>Phone:</b> {event.user.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}