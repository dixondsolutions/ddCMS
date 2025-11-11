import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TemplateSchema } from "../../shared/types/template";
import { DraggableComponent } from "./DraggableComponent";

interface BuilderRendererProps {
  schema: TemplateSchema;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onSelectComponent: (id: string) => void;
  selectedComponentId: string | null;
}

export function BuilderRenderer({
  schema,
  onReorder,
  onSelectComponent,
  selectedComponentId,
}: BuilderRendererProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = schema.components.findIndex((c) => c.id === active.id);
      const newIndex = schema.components.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={schema.components.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {schema.components.map((component) => (
            <DraggableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={() => onSelectComponent(component.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
