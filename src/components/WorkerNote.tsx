import React from 'react'

const WorkerNote = ({ note }: { note: string }) => {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-lg p-2 rounded-lg bg-red-600 text-white my-4">
          {note}
        </p>
      </div>
    </div>
  )
}

export default WorkerNote