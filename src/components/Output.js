export default function Output({ content }) {
  return (
    <div className="output-container bg-white p-4 rounded-lg shadow-lg h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-2 text-blue-600">Execution Result:</h3>
      <pre className="bg-gray-100 p-4 rounded">{content}</pre>
    </div>
  )
}