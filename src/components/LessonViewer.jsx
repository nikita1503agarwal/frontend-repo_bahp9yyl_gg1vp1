import { useEffect, useState } from 'react'

export default function LessonViewer({ topic, backendUrl }) {
  const [lessons, setLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [exercises, setExercises] = useState([])
  const [answers, setAnswers] = useState({}) // { [exerciseId]: value }
  const [feedback, setFeedback] = useState({}) // { [exerciseId]: { correct, explanation } }

  useEffect(() => {
    if (!topic) return
    const fetchLessons = async () => {
      const res = await fetch(`${backendUrl}/api/topics/${topic._id}/lessons`)
      const data = await res.json()
      setLessons(data)
      setActiveLesson(data[0] || null)
      setExercises([])
      setAnswers({})
      setFeedback({})
    }
    fetchLessons()
  }, [topic, backendUrl])

  useEffect(() => {
    if (!activeLesson) return
    const fetchExercises = async () => {
      const res = await fetch(`${backendUrl}/api/lessons/${activeLesson._id}/exercises`)
      const data = await res.json()
      setExercises(data)
      setAnswers({})
      setFeedback({})
    }
    fetchExercises()
  }, [activeLesson, backendUrl])

  const normalize = (s) => (s ?? '').toString().trim()

  const submitAnswer = (ex) => {
    const userAnswer = answers[ex._id]
    if (ex.type === 'mcq') {
      const correct = userAnswer === ex.answer
      setFeedback((f) => ({ ...f, [ex._id]: { correct, explanation: ex.explanation } }))
    } else {
      // text question: case-insensitive, trimmed comparison
      const correct = normalize(userAnswer).toLowerCase() === normalize(ex.answer).toLowerCase()
      setFeedback((f) => ({ ...f, [ex._id]: { correct, explanation: ex.explanation } }))
    }
  }

  const setAnswerFor = (exId, value) => {
    setAnswers((a) => ({ ...a, [exId]: value }))
  }

  if (!topic) {
    return (
      <div className="p-6 text-gray-600">Select a topic to begin learning.</div>
    )
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800">{topic.title}</h2>
        <p className="text-gray-600 mb-4">{topic.description}</p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {activeLesson ? (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-xl font-semibold text-gray-800">{activeLesson.title}</h3>
                <pre className="mt-3 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">{activeLesson.content}</pre>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-gray-500">No lessons yet.</div>
            )}

            <div className="mt-4 bg-white rounded-lg shadow p-4">
              <h4 className="text-lg font-semibold text-gray-800">Exercises</h4>
              {exercises.length === 0 ? (
                <p className="text-gray-500 text-sm">No exercises for this lesson.</p>
              ) : (
                exercises.map((ex) => (
                  <div key={ex._id} className="mt-4 border-t pt-4">
                    <p className="font-medium">{ex.question}</p>

                    {ex.type === 'mcq' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {ex.options?.map((op) => (
                          <label key={op.key} className={`inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer transition hover:bg-gray-50 ${answers[ex._id] === op.key ? 'bg-indigo-50 border-indigo-200' : ''}`}>
                            <input
                              type="radio"
                              name={`q-${ex._id}`}
                              value={op.key}
                              checked={answers[ex._id] === op.key}
                              onChange={(e) => setAnswerFor(ex._id, e.target.value)}
                            />
                            <span>{op.key}. {op.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {ex.type === 'text' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Type your answer…"
                          value={answers[ex._id] ?? ''}
                          onChange={(e) => setAnswerFor(ex._id, e.target.value)}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => submitAnswer(ex)}
                      className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded"
                    >
                      Check answer
                    </button>

                    {feedback[ex._id] && (
                      <div className={`mt-3 p-3 rounded ${feedback[ex._id].correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {feedback[ex._id].correct ? 'Correct!' : 'Not quite.'} {feedback[ex._id].explanation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-3">
              <h4 className="font-semibold text-gray-700">Lessons</h4>
              <div className="mt-2 space-y-1">
                {lessons.map((l) => (
                  <button
                    key={l._id}
                    onClick={() => setActiveLesson(l)}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-indigo-50 ${activeLesson?._id === l._id ? 'bg-indigo-100 text-indigo-800' : ''}`}
                  >
                    <span className="block text-sm font-medium">{l.title}</span>
                    <span className="block text-xs text-gray-500">level: {l.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
