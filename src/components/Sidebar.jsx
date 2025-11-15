export default function Sidebar({ topics, currentTopicId, onSelectTopic }) {
  return (
    <aside className="w-full sm:w-64 border-r bg-white/60 backdrop-blur">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">C# Curriculum</h2>
        <nav className="mt-3 space-y-1">
          {topics.map((t) => (
            <button
              key={t._id}
              onClick={() => onSelectTopic(t)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-indigo-50 transition ${
                currentTopicId === t._id ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'
              }`}
            >
              <span className="block text-sm font-medium">{t.title}</span>
              <span className="block text-xs text-gray-500">{t.description}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
