import React, { useEffect, useState } from 'react';

const PlotMap = () => {
  const [plots, setPlots] = useState([]);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [areaRange, setAreaRange] = useState([0, Infinity]);

  const MIN_SLIDER = 0;
  const MAX_SLIDER = 10000;

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}future-plan-data.json`)
      .then(res => res.json())
      .then(data => {
        const parsed = data
          .map(plot => {
            const plotNo = parseInt(plot.plotNo) || 0;
            let raw = 0;
            try {
              raw =
                typeof plot.Area === 'string'
                  ? parseFloat(plot.Area.split(' ')[0])
                  : NaN;
            } catch {
              raw = NaN;
            }
            return {
              ...plot,
              plotNo,
              areaValue: isNaN(raw) ? 0 : raw,
            };
          })
          .filter(p => p.plotNo >= 306 && p.plotNo <= 323);

        const part1 = parsed
          .filter(p => p.plotNo <= 314)
          .sort((a, b) => b.plotNo - a.plotNo);
        const part2 = parsed
          .filter(p => p.plotNo >= 315)
          .sort((a, b) => a.plotNo - b.plotNo);

        const finalPlots = [...part1, ...part2];
        setPlots(finalPlots);

        const areas = finalPlots.map(p => p.areaValue);
        const min = Math.min(...areas.filter(a => a > 0));
        const max = Math.max(...areas.filter(a => a > 0));
        setAreaRange([min, max]);
      })
      .catch(err => {
        console.error('[PlotMap] fetch/data error:', err);
      });
  }, []);

  const applyAreaFilter = p =>
    typeof p.areaValue === 'number' &&
    p.areaValue >= areaRange[0] &&
    p.areaValue <= areaRange[1];

  const handleSlider = e => {
    const mid = parseFloat(e.target.value);
    const delta = 500;
    const newMin = Math.max(MIN_SLIDER, mid - delta);
    const newMax = Math.min(MAX_SLIDER, mid + delta);
    setAreaRange([newMin, newMax]);
  };

  const reset = () => {
    setAreaRange([MIN_SLIDER, MAX_SLIDER]);
  };

  const getStatusClass = status => {
    const s = status?.toLowerCase();
    if (s === 'available') return 'bg-green-500 text-white';
    if (s === 'hold') return 'bg-orange-500 text-white';
    if (s === 'block' || s === 'blocked') return 'bg-blue-500 text-white';
    if (s === 'sold') return 'bg-red-500 text-white';
    return 'bg-gray-300 text-black';
  };

  const getStatusTextColor = status => {
    return (
      {
        available: 'text-green-600',
        hold: 'text-orange-500',
        block: 'text-blue-500',
        blocked: 'text-blue-500',
        sold: 'text-red-500',
      }[status?.toLowerCase()] || 'text-gray-600'
    );
  };

  return (
    <div>
      {/* Layout background */}
      <div
        className="relative bg-contain bg-center h-[880px] bg-no-repeat"
        style={{ backgroundImage: `url("./images/future-layout.jpg")` }}
      >
        <img
          src="./images/gsquare-logo.jpg"
          alt="Logo"
          className="absolute top-5 right-5 w-40"
        />

        {/* Plot Grid */}
        <div className="absolute top-[381px] left-[511px] p-4">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {plots.map(plot => (
              <div
                key={plot.plotNo}
                className={`relative border text-center w-[58px] h-[95px] flex items-center justify-center cursor-pointer hover:bg-white hover:text-black ${
                  selectedPlot?.plotNo === plot.plotNo
                    ? 'bg-yellow-400 text-black'
                    : getStatusClass(plot.status)
                } ${!applyAreaFilter(plot) ? 'invisible' : ''}`}
                onMouseEnter={() => setHoveredPlot(plot.plotNo)}
                onMouseLeave={() => setHoveredPlot(null)}
                onClick={() => setSelectedPlot(plot)}
              >
                <p className="font-bold text-sm">{plot.plotNo}</p>

                {hoveredPlot === plot.plotNo && (
                  <div className="absolute bottom-[100%] mb-2 left-1/2 -translate-x-1/2 w-[250px] bg-black text-white p-3 rounded shadow-lg z-50">
                    <div className="flex justify-between mb-1">
                      <p className="font-bold">{plot.plotNo}</p>
                      <p className="text-sm">{plot.Area}</p>
                    </div>
                    <ul>
                      <li className="flex justify-between">
                        <strong>Booking Value:</strong> {plot['Booking Value']}
                      </li>
                      <li className="flex justify-between">
                        <strong>All In Value:</strong> {plot['All In Value']}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area Slider Filter */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50 w-64">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Filter Area</h3>
          <button className="text-blue-500 text-sm" onClick={reset}>
            Reset
          </button>
        </div>
        <label className="text-sm mb-1 block">
          Area: {Math.round(areaRange[0])} – {Math.round(areaRange[1])} Sq. Ft.
        </label>
        <input
          type="range"
          min={MIN_SLIDER}
          max={MAX_SLIDER}
          value={(areaRange[0] + areaRange[1]) / 2}
          onChange={handleSlider}
          className="w-full"
        />
      </div>

      {/* Plot Details Popup */}
      {selectedPlot && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded shadow-lg p-4 w-[300px] z-50">
          <h2 className="text-lg font-bold mb-2">Plot No: {selectedPlot.plotNo}</h2>
          <ul className="text-sm space-y-1">
            <li className="flex justify-between">
              <strong>Area:</strong> {selectedPlot.Area}
            </li>
            <li className="flex justify-between">
              <strong>Size:</strong> {selectedPlot.size}
            </li>
            <li className="flex justify-between">
              <strong>Status:</strong>{' '}
              <span className={`${getStatusTextColor(selectedPlot.status)} font-semibold`}>
                {selectedPlot.status}
              </span>
            </li>
            <li className="flex justify-between">
              <strong>Typology:</strong> {selectedPlot.Typology}
            </li>
            <li className="flex justify-between">
              <strong>Booking Value:</strong> {selectedPlot['Booking Value']}
            </li>
            <li className="flex justify-between">
              <strong>All In Value:</strong> {selectedPlot['All In Value']}
            </li>
            <li className="flex justify-between">
              <strong>Location:</strong> {selectedPlot.location}
            </li>
            <li className="flex justify-between">
              <strong>East:</strong> {selectedPlot.East}
            </li>
            <li className="flex justify-between">
              <strong>West:</strong> {selectedPlot.West}
            </li>
            <li className="flex justify-between">
              <strong>North:</strong> {selectedPlot.North}
            </li>
            <li className="flex justify-between">
              <strong>South:</strong> {selectedPlot.South}
            </li>
          </ul>
          <button
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => setSelectedPlot(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Default "Choose Plot" Message */}
      {!selectedPlot && (
        <div className="fixed bottom-4 left-4 flex items-center justify-center w-[300px] h-[100px] bg-white rounded shadow text-xl font-semibold z-50">
          Choose Any Plot
        </div>
      )}
    </div>
  );
};

export default PlotMap;
