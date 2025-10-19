export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Family Tree Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create visual representations of your family tree with our drag-and-drop canvas editor
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Configurations</h3>
              <p className="text-gray-600">
                Set up different family tree projects with custom configurations and settings
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-3xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Flows</h3>
              <p className="text-gray-600">
                Create multiple flows within each configuration to organize different family branches
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-purple-600 text-3xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Canvas</h3>
              <p className="text-gray-600">
                Use our visual editor to drag and drop components and build beautiful family trees
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
            <div className="bg-white p-6 rounded-lg shadow-md text-left max-w-2xl mx-auto">
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  <strong>Create a Configuration:</strong> Use the header to create a new configuration for your family tree project
                </li>
                <li>
                  <strong>Add Flows:</strong> Create flows within your configuration to organize different family branches or sections
                </li>
                <li>
                  <strong>Open Canvas Editor:</strong> Navigate to the canvas editor for a specific flow to start building your family tree
                </li>
                <li>
                  <strong>Design Your Tree:</strong> Drag and drop components from the toolbox to create your visual family tree
                </li>
                <li>
                  <strong>Save Your Work:</strong> Use the footer controls to save your canvas and preserve your progress
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}