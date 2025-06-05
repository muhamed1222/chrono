import React from 'react';
import { Lightbulb, Copy } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const TemplatesView: React.FC = () => {
  const { templates, setCurrentView } = useAppContext();

  const handleUseTemplate = () => {
    // We would normally set the template content here in a real app
    // but for the MVP demo we just navigate to the post editor
    setCurrentView('post-editor');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold">Идеи для контента</h2>
        <p className="text-slate-400 mt-1">
          Готовые шаблоны для различных типов публикаций
        </p>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                  <Lightbulb size={18} className="text-amber-500" />
                </div>
                <h3 className="font-bold">{template.title}</h3>
              </div>
              
              <p className="text-sm text-slate-400 mb-3">
                {template.description}
              </p>
              
              <div className="p-3 bg-slate-700 rounded-lg mb-4 text-sm max-h-40 overflow-y-auto">
                {template.content}
              </div>
              
              <button
                onClick={handleUseTemplate}
                className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Copy size={14} className="mr-2" />
                Использовать шаблон
              </button>
            </div>
          ))}
          
          {/* Placeholder for more templates */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={`placeholder-${index}`}
              className="bg-slate-800/50 rounded-lg p-5 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                  <Lightbulb size={18} className="text-slate-500" />
                </div>
                <div className="h-5 bg-slate-700 rounded w-32"></div>
              </div>
              
              <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg mb-4 space-y-2">
                <div className="h-3 bg-slate-600 rounded w-full"></div>
                <div className="h-3 bg-slate-600 rounded w-full"></div>
                <div className="h-3 bg-slate-600 rounded w-4/5"></div>
              </div>
              
              <div className="w-full py-2 rounded-lg bg-slate-700/50 text-sm font-medium flex items-center justify-center text-slate-500">
                <span className="mr-2">•••</span>
                Скоро
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesView;