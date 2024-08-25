import React from 'react';
import { Button } from 'antd';

interface NavigationHeaderProps {
  title: string;
  calendarColor?: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  calendarColor,
  onPrev,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className={`text-2xl font-bold text-${calendarColor}-600`}>{title}</div>
      <div className="flex items-center space-x-3">
        <Button
          onClick={onPrev}
          className={`text-lg text-${calendarColor}-600 hover:text-${calendarColor}-700`}
        >
          &lt;
        </Button>
        <Button
          onClick={onNext}
          className={`text-lg text-${calendarColor}-600 hover:text-${calendarColor}-700`}
        >
          &gt;
        </Button>
        <Button
          onClick={onToday}
          className={`text-lg text-${calendarColor}-600 hover:text-${calendarColor}-700`}
        >
          Today
        </Button>
      </div>
    </div>
  );
};
