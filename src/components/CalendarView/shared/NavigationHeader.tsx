import React from 'react';
import { Button, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Configuration from '../../Configuration';

interface NavigationHeaderProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onPrev,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-2xl font-bold text-indigo-600">{title}</div>
      <div className="flex items-center space-x-3">
        <Button
          onClick={onPrev}
          className="text-lg text-indigo-600 hover:text-indigo-700"
        >
          &lt;
        </Button>
        <Button
          onClick={onNext}
          className="text-lg text-indigo-600 hover:text-indigo-700"
        >
          &gt;
        </Button>
        <Button
          onClick={onToday}
          className="text-lg text-indigo-600 hover:text-indigo-700 "
        >
          Today
        </Button>
        <Popover content={<Configuration />} trigger="click" placement="bottomRight">
          <Button
            icon={<SettingOutlined />}
            shape="circle"
            size="large"
            className="text-gray-500 hover:text-indigo-700"
            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
          />
        </Popover>
      </div>
    </div>
  );
};
