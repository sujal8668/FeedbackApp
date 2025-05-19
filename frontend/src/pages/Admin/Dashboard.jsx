import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import AdminDashLayout from "../../components/layouts/AdminDashLayout";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";

const EMOJI_COLORS = {
  "very clean": "#FFA500",
  clean: "#008000",
  average: "#90EE90",
  dirty: "#FFFF00",
  "very dirty": "#FF0000",
};

const WEEKDAY_COLORS = [
  "#1f77b4",
  "#9467bd",
  "#2ca02c",
  "#fdd0a2",
  "#d62728",
  "#8c564b",
  "#ff7f0e",
];

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const EMOJI_ORDER = ["very clean", "clean", "average", "dirty", "very dirty"];

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieChartFilter, setPieChartFilter] = useState("all");
  const [barChartFilter, setBarChartFilter] = useState("all");
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get("/api/feedback/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFeedbacks(res.data);
      } catch (error) {
        toast.error("Failed to load feedbacks");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const getFilteredFeedbacks = (filter) => {
    const now = new Date();
  
    return feedbacks.filter((fb) => {
      const fbDate = new Date(fb.createdAt);
      switch (filter) {
        case "weekly":
          // Clone 'now' before modifying it
          const startOfWeek = new Date();
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0); // Normalize to start of the day
          return fbDate >= startOfWeek;
        case "monthly":
          return (
            fbDate.getMonth() === now.getMonth() &&
            fbDate.getFullYear() === now.getFullYear()
          );
        case "yearly":
          return fbDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };
  

  const pieChartFeedbacks = getFilteredFeedbacks(pieChartFilter);
  const barChartFeedbacks = getFilteredFeedbacks(barChartFilter);

  const pieChartData = EMOJI_ORDER.filter((emoji) => {
    const count = pieChartFeedbacks.filter(
      (fb) => fb.emoji.toLowerCase() === emoji
    ).length;
    return count > 0;
  }).map((emoji) => ({
    name: capitalizeWords(emoji),
    value: pieChartFeedbacks.filter(
      (fb) => fb.emoji.toLowerCase() === emoji
    ).length,
  }));

  const barChartData = EMOJI_ORDER.filter((emoji) => {
    const count = barChartFeedbacks.filter(
      (fb) => fb.emoji.toLowerCase() === emoji
    ).length;
    return count > 0;
  }).map((emoji) => ({
    name: capitalizeWords(emoji),
    value: barChartFeedbacks.filter(
      (fb) => fb.emoji.toLowerCase() === emoji
    ).length,
  }));

  // Weekly Peak Hour data - always uses full dataset
  const peakHourData = Array.from({ length: 24 }, (_, hour) => {
    const hourData = { hour };
    for (let i = 0; i < 7; i++) hourData[i] = 0;
    return hourData;
  });

  feedbacks.forEach((fb) => {
    const date = new Date(fb.createdAt);
    const day = date.getDay();
    const hour = date.getHours();
    if (peakHourData[hour]) peakHourData[hour][day] += 1;
  });

  const displayedFeedbacks = showAllFeedbacks
    ? feedbacks
    : feedbacks.slice(0, 6);

  return (
    <AdminDashLayout activeMenu="Dashboard">
      <div className="p-4 md:p-6 space-y-6 ">

        {/* Feedback Summary */}
        <div>
          <div className="flex flex-col mb-4 gap-2">
            <h1 className="text-lg md:text-2xl font-semibold">
              Feedback Summary: {feedbacks.length} Feedbacks
            </h1>
            <p className="text-gray-600">Report and analysis of feedbacks.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {EMOJI_ORDER.map((emoji) => {
              const count = feedbacks.filter(
                (fb) => fb.emoji.toLowerCase() === emoji
              ).length;
              return count > 0 ? (
                <div
                  key={emoji}
                  className="bg-white text-black p-4 rounded-xl shadow-xl text-center"
                >
                  <p className="text-base md:text-lg font-semibold">
                    {capitalizeWords(emoji)}
                  </p>
                  <p className="text-xl md:text-2xl font-semibold">
                    {count}
                  </p>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Pie Chart */}
          <div className="w-full bg-white rounded-xl shadow-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg md:text-xl font-semibold">Pie Chart</h2>
              <select
                className="border px-2 py-1.5 rounded text-black cursor-pointer outline-none"
                value={pieChartFilter}
                onChange={(e) => setPieChartFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        EMOJI_COLORS[entry.name.toLowerCase()] || "#8884d8"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, capitalizeWords(name)]}
                />
                <Legend formatter={(value) => capitalizeWords(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="w-full bg-white rounded-xl shadow-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg md:text-xl font-semibold">Bar Chart</h2>
              <select
                className="border px-2 py-1.5 rounded text-black cursor-pointer outline-none"
                value={barChartFilter}
                onChange={(e) => setBarChartFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-bar-${index}`}
                      fill={
                        EMOJI_COLORS[entry.name.toLowerCase()] || "#8884d8"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Peak Hour Chart */}
        <div className="bg-white rounded-xl shadow-xl p-4">
          <h2 className="text-lg md:text-xl font-semibold mb-8">
            Weekly Peak Hour Feedback Data
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: WEEKDAY_COLORS[idx] }}
                ></div>
                <span className="text-sm md:text-base">{day}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                label={{
                  value: "Hour (0–23)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              {Array.from({ length: 7 }).map((_, day) => (
                <Bar
                  key={day}
                  dataKey={String(day)}
                  stackId="a"
                  fill={WEEKDAY_COLORS[day]}
                  name={[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][day]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Feedbacks */}
        <div className="bg-white rounded-xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg md:text-xl font-semibold">
              Recent Feedbacks
            </h2>
            {feedbacks.length > 6 && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md cursor-pointer"
                onClick={() => setShowAllFeedbacks((prev) => !prev)}
              >
                {showAllFeedbacks ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base border text-center border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">User Name</th>
                  <th className="py-2 px-4 border-b">Emoji</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedFeedbacks.map((fb) => (
                  <tr key={fb._id} className="border-t">
                    <td className="py-2 px-4">
                      {fb.user?.name || "Unknown User"}
                    </td>
                    <td className="py-2 px-4">{capitalizeWords(fb.emoji)}</td>
                    <td className="py-2 px-4">
                      {new Date(fb.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {feedbacks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No feedbacks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminDashLayout>
  );
};

export default Dashboard;
