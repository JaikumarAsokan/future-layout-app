import React, { useEffect, useState } from 'react';

const plotStyles = {
  306: { top: '50.9%', left: '67.2%', width: '3.5%', height: '10.3%', transform: 'rotate(1deg)' },
  307: { top: '50.8%', left: '63.55%', width: '3.4%', height: '10.3%', transform: 'rotate(1deg)' },
  308: { top: '50.8%', left: '60%', width: '3.4%', height: '10.3%', transform: 'rotate(1deg)' },
  309: { top: '50.8%', left: '56.4%', width: '3.7%', height: '10.3%', transform: 'rotate(1deg)' },
  310: { top: '50.7%', left: '52.6%', width: '3.5%', height: '10.4%', transform: 'rotate(1deg)' },
  311: { top: '50.7%', left: '48.9%', width: '3.6%', height: '10.3%', transform: 'rotate(1deg)' },
  312: { top: '50.6%', left: '45.3%', width: '3.5%', height: '10.3%', transform: 'rotate(1deg)' },
  313: { top: '50.5%', left: '41.6%', width: '3.3%', height: '10.3%', transform: 'rotate(1deg)' },
  314: { top: '50.5%', left: '37.4%', width: '4.9%', height: '10.3%', transform: 'rotate(1deg)' },
  315: { top: '61.5%', left: '37.3%', width: '4.9%', height: '10.9%', transform: 'rotate(1deg)' },
  316: { top: '61.6%', left: '41.5%', width: '3.3%', height: '10.9%', transform: 'rotate(1deg)' },
  317: { top: '61.6%', left: '45.3%', width: '3.5%', height: '10.9%', transform: 'rotate(1deg)' },
  318: { top: '61.6%', left: '48.9%', width: '3.6%', height: '10.9%', transform: 'rotate(1deg)' },
  319: { top: '61.6%', left: '52.6%', width: '3.5%', height: '10.9%', transform: 'rotate(1deg)' },
  320: { top: '61.6%', left: '56.3%', width: '3.5%', height: '10.9%', transform: 'rotate(1deg)' },
  321: { top: '61.6%', left: '59.9%', width: '3.4%', height: '10.9%', transform: 'rotate(1deg)' },
  322: { top: '61.6%', left: '63.55%', width: '3.4%', height: '10.9%', transform: 'rotate(1deg)' },
  323: { top: '61.6%', left: '67.2%', width: '3.5%', height: '10.9%', transform: 'rotate(1deg)' },
};

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
              raw = typeof plot.Area === 'string'
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
    <div className="w-screen h-screen overflow-hidden">
      <img 
  src="./images/gsquare-logo.jpg"
  alt="Logo"
  className="fixed top-[2vh] right-[2vw] w-[10vw] max-w-[10vw] h-auto z-50"
/>



      <div className="relative mx-auto origin-top scale-[1] w-[1520px] h-auto" style={{ aspectRatio: '16/9' }}>
        <img
          src="./images/future-layout.jpg"
          alt="Layout"
          className="w-full h-full object-cover"
        />

        


        {plots.map(plot => {
          const pos = plotStyles[plot.plotNo];
          if (!pos) return null;

          return (
            <div
              key={plot.plotNo}
              className={`absolute border flex items-center justify-center text-xs font-semibold cursor-pointer
                hover:bg-white hover:text-black z-10 opacity-85
                ${selectedPlot?.plotNo === plot.plotNo
                  ? 'bg-yellow-300 text-black'
                  : getStatusClass(plot.status)}
                ${!applyAreaFilter(plot) ? 'invisible' : ''}
              `}
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
                transform: `${pos.transform || ''} translate(-50%, -50%)`,
                transformOrigin: 'center',
              }}
              onMouseEnter={() => setHoveredPlot(plot.plotNo)}
              onMouseLeave={() => setHoveredPlot(null)}
              onClick={() => setSelectedPlot(plot)}
            >
              <p className="text-lg">{plot.plotNo}</p>
              {hoveredPlot === plot.plotNo && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 bg-black text-white text-sm p-3 rounded shadow-lg z-50">
                  <div className="flex justify-between">
                    <p className="font-bold">{plot.plotNo}</p>
                    <p>{plot.Area}</p>
                  </div>
                  <div className="mt-1">
                    <p className="flex justify-between">
                      <span>Booking Value:</span> <span>{plot["Booking Value"]}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>All In Value:</span> <span>{plot["All In Value"]}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Area Slider */}
      <div className="fixed bottom-[2vh] right-[2vw] bg-white p-[1.2vw] rounded shadow-lg z-50 w-[20vw] text-[1vw]">
  <div className="flex justify-between items-center mb-[0.8vw]">
    <h3 className="font-bold text-[1vw]">Filter Area</h3>
    <button className="text-blue-500 text-[0.9vw]" onClick={reset}>
      Reset
    </button>
  </div>
  <label className="text-[0.9vw] mb-[0.6vw] block">
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


      {/* Plot Detail Popup */}
      {selectedPlot && (
        <div className="fixed bottom-[2vh] left-[2vw] bg-white border border-gray-300 rounded shadow-lg p-[1.5vh] w-[24vw] z-50">
  <h2 className="text-[1.2vw] font-bold mb-[1vh]">Plot No: {selectedPlot.plotNo}</h2>
  <ul className="text-[0.95vw] space-y-[0.6vh]">
    <li className="flex justify-between"><strong>Area:</strong> {selectedPlot.Area}</li>
    <li className="flex justify-between"><strong>Size:</strong> {selectedPlot.size}</li>
    <li className="flex justify-between"><strong>Status:</strong> <span className={`${getStatusTextColor(selectedPlot.status)} font-semibold`}>{selectedPlot.status}</span></li>
    <li className="flex justify-between"><strong>Typology:</strong> {selectedPlot.Typology}</li>
    <li className="flex justify-between"><strong>Booking Value:</strong> {selectedPlot['Booking Value']}</li>
    <li className="flex justify-between"><strong>All In Value:</strong> {selectedPlot['All In Value']}</li>
    <li className="flex justify-between"><strong>Location:</strong> {selectedPlot.location}</li>
    <li className="flex justify-between"><strong>East:</strong> {selectedPlot.East}</li>
    <li className="flex justify-between"><strong>West:</strong> {selectedPlot.West}</li>
    <li className="flex justify-between"><strong>North:</strong> {selectedPlot.North}</li>
    <li className="flex justify-between"><strong>South:</strong> {selectedPlot.South}</li>
  </ul>
  <button
    className="mt-[1vh] bg-red-500 text-white px-[1.2vw] py-[0.5vh] rounded text-[0.9vw]"
    onClick={() => setSelectedPlot(null)}
  >
    Close
  </button>
</div>

      )}

      {/* Choose Any Plot */}
      {!selectedPlot && (
        <div className="fixed bottom-[2vh] left-[2vw] flex items-center justify-center w-[20vw] h-[8vh] bg-white rounded shadow text-[1.2vw] font-semibold z-50">
  Choose Any Plot
</div>

      )}
    </div>
  );
};

export default PlotMap;
