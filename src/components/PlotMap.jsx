import React, { useEffect, useState } from "react";

const PlotMap = () => {
  const [plots, setPlots] = useState([]);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [areaRange, setAreaRange] = useState([189, 5527]);
  const MIN_AREA = 189;
  const MAX_AREA = 5527;

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}future-plan-data.json`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .map((plot) => ({
            ...plot,
            plotNo: parseInt(plot.plotNo),
            areaValue: parseFloat(plot.Area.split(" ")[0]),
          }))
          .filter((plot) => plot.plotNo >= 306 && plot.plotNo <= 323);

        const part1 = filtered
          .filter((plot) => plot.plotNo <= 314)
          .sort((a, b) => b.plotNo - a.plotNo);

        const part2 = filtered
          .filter((plot) => plot.plotNo >= 315)
          .sort((a, b) => a.plotNo - b.plotNo);

        setPlots([...part1, ...part2]);
      });
  }, []);

  const getStatusClass = (status) => {
    const baseClass = "text-white";
    const colorClass =
      {
        available: "bg-green-500",
        block: "bg-blue-500",
        blocked: "bg-blue-500",
        hold: "bg-orange-500",
        sold: "bg-red-500",
      }[status.toLowerCase()] || "bg-gray-300";

    return `${colorClass} ${baseClass}`;
  };

  const getStatusTextColor = (status) => {
    return (
      {
        available: "text-green-600",
        hold: "text-orange-500",
        block: "text-blue-500",
        blocked: "text-blue-500",
        sold: "text-red-500",
      }[status.toLowerCase()] || "text-gray-600"
    );
  };

  const applyAreaFilter = (plot) => {
    const area = plot.areaValue;
    return area >= areaRange[0] && area <= areaRange[1];
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    const rangeSize = 1000;
    const min = Math.max(MIN_AREA, value - rangeSize / 2);
    const max = Math.min(MAX_AREA, value + rangeSize / 2);
    setAreaRange([min, max]);
  };

  const resetFilters = () => {
    setAreaRange([MIN_AREA, MAX_AREA]);
  };

  return (
    <div>
      {/* Background Image */}
      <div
        className="relative bg-contain bg-center h-[880px] bg-no-repeat"
        style={{ backgroundImage: `url("./images/future-layout.jpg")` }}
      >
        <img
          src="./images/gsquare-logo.jpg"
          alt="G Square Logo"
          className="absolute top-5 right-5 w-40"
        />

        {/* Plot Grid */}
        <div className="absolute top-[381px] left-[511px] p-4">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {plots.map((plot) => (
              <div
                key={plot.plotNo}
                className={`relative border text-center w-[58px] h-[95px] 
                  flex items-center justify-center cursor-pointer
                  hover:bg-white hover:text-black 
                  ${
                    selectedPlot?.plotNo === plot.plotNo
                      ? "bg-[#FFFF00] text-black"
                      : getStatusClass(plot.status)
                  }
                  ${!applyAreaFilter(plot) ? "invisible" : ""}
                `}
                onMouseEnter={() => setHoveredPlot(plot.plotNo)}
                onMouseLeave={() => setHoveredPlot(null)}
                onClick={() => setSelectedPlot(plot)}
              >
                <p className="font-bold text-sm">{plot.plotNo}</p>

                {hoveredPlot === plot.plotNo && (
                  <div className="absolute bottom-[100%] mb-2 left-1/2 -translate-x-1/2
                      w-[250px] bg-black text-white p-3 rounded-md shadow-lg
                      transition-all duration-300 z-50">
                    <div className="flex justify-between mb-1">
                      <p className="font-bold">{plot.plotNo}</p>
                      <p className="text-sm">{plot.Area}</p>
                    </div>
                    <ul>
                      <li className="flex justify-between">
                        <strong>Booking Value:</strong> {plot["Booking Value"]}
                      </li>
                      <li className="flex justify-between">
                        <strong>All In Value:</strong> {plot["All In Value"]}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Bottom - Filter Panel */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50 w-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Filters</h3>
          <button onClick={resetFilters} className="text-sm text-blue-500">
            Reset
          </button>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">
            Area: {areaRange[0]} - {areaRange[1]} Sq. Ft.
          </label>
          <div className="flex items-center space-x-2 text-xs">
            <span>{MIN_AREA}</span>
            <input
              type="range"
              min={MIN_AREA}
              max={MAX_AREA}
              value={(areaRange[0] + areaRange[1]) / 2}
              onChange={handleSliderChange}
              className="w-full"
            />
            <span>{MAX_AREA}</span>
          </div>
        </div>
      </div>

      {/* Bottom Left - Selected Plot Details */}
      {selectedPlot && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-[300px] z-50">
          <h2 className="text-lg font-bold mb-2">
            Plot No: {selectedPlot.plotNo}
          </h2>
          <ul className="text-sm space-y-1">
            <li className="flex justify-between">
              <strong>Area:</strong> {selectedPlot.Area}
            </li>
            <li className="flex justify-between">
              <strong>Size:</strong> {selectedPlot.size}
            </li>
            <li className="flex justify-between">
              <strong>Status:</strong>{" "}
              <span
                className={`${getStatusTextColor(
                  selectedPlot.status
                )} font-semibold`}
              >
                {selectedPlot.status}
              </span>
            </li>
            <li className="flex justify-between">
              <strong>Typology:</strong> {selectedPlot.Typology}
            </li>
            <li className="flex justify-between">
              <strong>Booking Value:</strong> {selectedPlot["Booking Value"]}
            </li>
            <li className="flex justify-between">
              <strong>All In Value:</strong> {selectedPlot["All In Value"]}
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
            className="mt-3 px-3 py-1 text-sm bg-red-500 text-white rounded"
            onClick={() => setSelectedPlot(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Choose Plot Popup */}
      {!selectedPlot && (
        <div className="fixed bottom-4 left-4 bg-white flex justify-center items-center
          w-[300px] h-[100px] font-semibold px-4 py-2 rounded shadow-md z-50 text-xl">
          Choose Any Plot
        </div>
      )}
    </div>
  );
};

export default PlotMap;
