import { Button, InputNumber } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export default function QuantityInput({ value, onChange, max = 999 }: QuantityInputProps) {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleChange = (val: number | null) => {
    if (val !== null) {
      const safeVal = Math.min(Math.max(1, val), max);
      onChange(safeVal);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button 
        icon={<MinusOutlined />} 
        onClick={handleDecrease} 
        disabled={value <= 1}
        style={{ borderRadius: '4px 0 0 4px' }}
      />
      <InputNumber 
        min={1} 
        max={max} 
        value={value} 
        onChange={handleChange} 
        controls={false}
        style={{ 
          width: '50px', 
          textAlign: 'center', 
          borderRadius: 0,
          borderLeft: 0,
          borderRight: 0,
        }} 
      />
      <Button 
        icon={<PlusOutlined />} 
        onClick={handleIncrease} 
        disabled={value >= max}
        style={{ borderRadius: '0 4px 4px 0' }}
      />
    </div>
  );
}
