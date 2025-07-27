import React, { useEffect, useState } from "react";
    // import layoutImage from "";

const PlotMap = () => {
  const [plots, setPlots] = useState([]);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    fetch("/future-plan-data.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .map((plot) => ({
            ...plot,
            plotNo: parseInt(plot.plotNo),
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

  return (
    <div>
      {/* Layout Image */}
      <div
        className="relative bg-contain bg-center h-[880px] bg-no-repeat"
        style={{ backgroundImage: `url("/images/future-layout.jpg")` }}
      >
        <img
          src="/images/gsquare-logo.jpg"
          alt="G Square Logo"
          className="absolute top-5 left-5 w-40"
        />
        {/* Plot Grid */}
        <div className="absolute top-[381px] left-[511px] p-4">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 ">
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
                  }`}
                onMouseEnter={() => setHoveredPlot(plot.plotNo)}
                onMouseLeave={() => setHoveredPlot(null)}
                onClick={() => setSelectedPlot(plot)}
              >
                <p className="font-bold text-sm">{plot.plotNo}</p>

                {/* Tooltip on hover */}
                {hoveredPlot === plot.plotNo && (
                  <div
                    className="absolute bottom-[100%] mb-2 left-1/2 -translate-x-1/2
                      w-[250px] bg-black text-white p-3 rounded-md shadow-lg
                      transition-all duration-300 z-50"
                  >
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

      {/* Bottom Left Popup - Plot Details */}
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

      {/* Bottom Left Popup - Choose Plot */}
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
