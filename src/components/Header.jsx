import { BookOpen, RefreshCcw } from 'lucide-react'

export default function Header({ onSeed, seeding, backendUrl }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">C# Learning Playground</h1>
            <p className="text-xs text-gray-500">Powered by your personal AI tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">API: {backendUrl}</span>
          <button
            onClick={onSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm transition"
          >
            <RefreshCcw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Seeding...' : 'Seed sample content'}
          </button>
        </div>
      </div>
    </header>
  )
}
