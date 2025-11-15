import { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import LessonViewer from './components/LessonViewer'

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [topics, setTopics] = useState([])
  const [currentTopic, setCurrentTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const loadTopics = async () => {
    setLoading(true)
    const res = await fetch(`${backendUrl}/api/topics`)
    if (res.ok) {
      const data = await res.json()
      setTopics(data)
      setCurrentTopic(data[0] || null)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTopics()
  }, [])

  const seedContent = async () => {
    setSeeding(true)
    try {
      await fetch(`${backendUrl}/api/seed`, { method: 'POST' })
      await loadTopics()
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 flex flex-col">
      <Header onSeed={seedContent} seeding={seeding} backendUrl={backendUrl} />
      <div className="flex-1 flex max-w-6xl mx-auto w-full gap-4 p-4">
        <Sidebar
          topics={topics}
          currentTopicId={currentTopic?._id}
          onSelectTopic={setCurrentTopic}
        />

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
        ) : (
          <LessonViewer topic={currentTopic} backendUrl={backendUrl} />
        )}
      </div>
    </div>
  )
}

export default App
