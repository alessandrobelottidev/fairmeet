import React, { useState, useRef, useEffect, ReactNode } from "react";

const BottomSheet = ({
  children,
  minHeight = 100,
  maxHeight = 600,
}: {
  children: ReactNode;
  minHeight: number;
  maxHeight: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(minHeight);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(height);
  const [isExpanded, setIsExpanded] = useState(false);

  const sheetRef = useRef(null);
  const dragHandleRef = useRef(null);

  const onDragStart = (e: any) => {
    const touch = e.touches?.[0] ?? e;
    setIsDragging(true);
    setStartY(touch.clientY);
    setStartHeight(height);
  };

  const onDragMove = (e: any) => {
    if (!isDragging) return;

    const touch = e.touches?.[0] ?? e;
    const deltaY = startY - touch.clientY;
    const newHeight = Math.min(
      Math.max(startHeight + deltaY, minHeight),
      maxHeight
    );

    // Calculate the midpoint
    const midPoint = minHeight + (maxHeight - minHeight) / 2;

    // If we're dragging up and cross the midpoint, snap to max
    if (newHeight > midPoint && !isExpanded) {
      setHeight(maxHeight);
      setIsExpanded(true);
      return;
    }

    // If we're expanded and dragging down, allow movement
    if (isExpanded && deltaY < 0) {
      setHeight(newHeight);
      if (newHeight < midPoint) {
        setIsExpanded(false);
      }
    }

    // If not expanded, allow normal movement
    if (!isExpanded) {
      setHeight(newHeight);
    }
  };

  const onDragEnd = () => {
    setIsDragging(false);

    if (!isExpanded) {
      setHeight(minHeight);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDragMove);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchmove", onDragMove);
      window.addEventListener("touchend", onDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("touchend", onDragEnd);
    };
  }, [isDragging, isExpanded]);

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 z-[1000] left-0 right-0 bg-white rounded-t-3xl transition-transform duration-200 border shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
      style={{
        height: `${height}px`,
        transform: `translateY(${isDragging ? 0 : 0}px)`,
      }}
    >
      {/* Drag handle */}
      <div
        ref={dragHandleRef}
        className="w-full h-10 cursor-grab active:cursor-grabbing flex justify-center items-center"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div className="w-16 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Content container */}
      <div className="h-[calc(100%-2.5rem)] overflow-y-auto px-4">
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
