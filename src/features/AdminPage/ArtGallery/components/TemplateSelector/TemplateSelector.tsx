// TemplateSelector.tsx
const TEMPLATES = [
  { id: 'layout-1', name: 'Стандарт', icon: '■■' }, // Тут будет SVG-схема
  { id: 'layout-2', name: 'Три в ряд', icon: '■■■' },
];

export const TemplateSelector = ({ current, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="template-selector">
      <button onClick={() => setIsOpen(!isOpen)}>Обрати шаблон</button>
      
      {isOpen && (
        <div className="templates-popup">
          {TEMPLATES.map(tmpl => (
            <div 
              key={tmpl.id} 
              className="template-preview-card"
              onClick={() => onSelect(tmpl.id)}
            >
              {/* Тут будет визуальное превью разметки */}
              <div className="preview-icon">{tmpl.icon}</div>
              <span>{tmpl.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};