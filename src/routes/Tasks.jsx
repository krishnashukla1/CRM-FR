import React from 'react';

const Tasks = ({ tasks }) => {
  return (
    <div className="p-4 bg-white shadow-md md:p-6 rounded-xl">
      <h2 className="mb-4 text-lg font-semibold text-blue-600">📝 Your Tasks</h2>
      
      {tasks && tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={task._id || index} className="py-2 pl-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                <span className="text-xs text-gray-500">Priority: {task.priority}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks assigned yet.</p>
      )}
    </div>
  );
};

export default Tasks;