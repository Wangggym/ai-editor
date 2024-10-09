import dynamic from 'next/dynamic'
import Output from '../components/Output'

const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">AI Editor Demo</h1>
      </header>
      <main className="flex-grow flex p-4">
        <div className="w-1/2 pr-2">
          <Editor />
        </div>
        <div className="w-1/2 pl-2">
          <Output content="Code execution results will be displayed here" />
        </div>
      </main>
    </div>
  )
}
