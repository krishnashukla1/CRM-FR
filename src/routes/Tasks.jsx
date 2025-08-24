import React from 'react';

const Tasks = ({ tasks }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-blue-600 mb-4">📝 Your Tasks</h2>
      
      {tasks && tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={task._id || index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              <div className="flex justify-between items-center mt-2">
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