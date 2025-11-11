import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { TemplateComponent } from "../../shared/types/template";
import { renderComponent } from "../../shared/components/TemplateComponents";
import { useBuilderStore } from "../BuilderStore";
import toast from "react-hot-toast";

interface DraggableComponentProps {
  component: TemplateComponent;
  isSelected: boolean;
  onSelect: () => void;
}

export function DraggableComponent({
  component,
  isSelected,
  onSelect,
}: DraggableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const { removeComponent } = useBuilderStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete ${component.type} component?`)) {
      removeComponent(component.id);
      toast.success("Component removed");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-2 rounded-lg transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-transparent hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      {/* Drag handle and controls */}
      <div
        className={`absolute -left-10 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isDragging ? "opacity-100" : ""
        }`}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300"
          title="Delete component"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>

      {/* Component type label */}
      {isSelected && (
        <div className="absolute -top-3 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
          {component.type}
        </div>
      )}

      {/* Render the actual component */}
      <div className="pointer-events-none">
        {renderComponent(component)}
      </div>

      {/* Click overlay to enable selection */}
      <div className="absolute inset-0" />
    </div>
  );
}
