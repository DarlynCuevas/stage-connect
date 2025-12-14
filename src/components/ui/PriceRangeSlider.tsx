import * as Slider from '@radix-ui/react-slider';

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

export function PriceRangeSlider({ value, onChange, min = 0, max = 50000 }: PriceRangeSliderProps) {
  return (
    <div className="w-full px-2 py-4">
      <label className="block mb-2 font-semibold">Rango de precio (caché)</label>
      <div className="relative w-full h-12 flex items-center">
        {/* Valores actuales encima de cada thumb */}
        <div className="absolute left-0 -top-5" style={{ left: `calc(${((value[0] - min) / (max - min)) * 100}% - 16px)` }}>
          <span className="text-xs font-semibold text-primary bg-card px-2 py-0.5 rounded shadow">€{value[0].toLocaleString()}</span>
        </div>
        <div className="absolute left-0 -top-5" style={{ left: `calc(${((value[1] - min) / (max - min)) * 100}% - 16px)` }}>
          <span className="text-xs font-semibold text-primary bg-card px-2 py-0.5 rounded shadow">€{value[1].toLocaleString()}</span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-8"
          min={min}
          max={max}
          step={100}
          value={value}
          onValueChange={onChange}
        >
          <Slider.Track className="bg-muted-foreground/30 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-6 h-6 bg-background border-2 border-orange-500 rounded-full shadow transition-colors duration-200 focus:outline-none" />
          <Slider.Thumb className="block w-6 h-6 bg-background border-2 border-orange-500 rounded-full shadow transition-colors duration-200 focus:outline-none" />
        </Slider.Root>
      </div>
      <div className="flex justify-between text-xs mt-2">
        <span>€{min.toLocaleString()}</span>
        <span>€{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
