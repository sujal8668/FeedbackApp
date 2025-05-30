import React, { useContext, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
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
  "#1f77b4", "#9467bd", "#2ca02c", "#fdd0a2", "#d62728", "#8c564b", "#ff7f0e",
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
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

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
          const startOfWeek = new Date();
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
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
    value: pieChartFeedbacks.filter((fb) => fb.emoji.toLowerCase() === emoji)
      .length,
  }));

  const barChartData = EMOJI_ORDER.filter((emoji) => {
    const count = barChartFeedbacks.filter(
      (fb) => fb.emoji.toLowerCase() === emoji
    ).length;
    return count > 0;
  }).map((emoji) => ({
    name: capitalizeWords(emoji),
    value: barChartFeedbacks.filter((fb) => fb.emoji.toLowerCase() === emoji)
      .length,
  }));

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

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;
    try {
      await axiosInstance.delete(`/api/feedback/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
      toast.success("Feedback deleted.");
    } catch (error) {
      toast.error("Failed to delete feedback.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axiosInstance.delete(`/api/feedback/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFeedbacks([]);
      setShowDeleteAllModal(false);
      toast.success("All feedbacks deleted.");
    } catch (error) {
      toast.error("Failed to delete all feedbacks.");
    }
  };

  return (
    <AdminDashLayout activeMenu="Dashboard">
      <div className="p-4 md:p-6 space-y-6">

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
                  className="bg-white text-black p-4 rounded-xl shadow-xl text-center hover:translate-y-[-2px] transition-transform duration-200"
                >
                  <p className="text-base md:text-lg font-semibold">
                    {capitalizeWords(emoji)}
                  </p>
                  <p className="text-xl md:text-2xl font-semibold">{count}</p>
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
              <h2 className="text-lg font-semibold">Pie Chart</h2>
              <select
                className="border px-2 py-1 rounded-2xl outline-none cursor-pointer text-black"
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
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={EMOJI_COLORS[entry.name.toLowerCase()] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="w-full bg-white rounded-xl shadow-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Bar Chart</h2>
              <select
                className="border px-2 py-1 rounded-2xl outline-none cursor-pointer text-black"
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
                      key={index}
                      fill={EMOJI_COLORS[entry.name.toLowerCase()] || "#8884d8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hour Chart */}
        <div className="bg-white rounded-xl shadow-xl p-4">
          <h2 className="text-lg font-semibold mb-4">
            Weekly Peak Hour Feedback Data
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: WEEKDAY_COLORS[i] }}
                />
                <span>{day}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: "Hour (0–23)", position: "insideBottom", offset: -5 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              {Array.from({ length: 7 }).map((_, i) => (
                <Bar
                  key={i}
                  dataKey={String(i)}
                  stackId="a"
                  fill={WEEKDAY_COLORS[i]}
                  name={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i]}
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
            <div className="flex gap-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md cursor-pointer"
                onClick={() => setShowDeleteAllModal(true)}
              >
                Delete All
              </button>
              {feedbacks.length > 6 && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md cursor-pointer"
                  onClick={() => setShowAllFeedbacks((prev) => !prev)}
                >
                  {showAllFeedbacks ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base border text-center border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">User Name</th>
                  <th className="py-2 px-4 border-b">Emoji</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedFeedbacks.map((fb) => (
                  <tr key={fb._id} className="border-t hover:bg-gray-100">
                    <td className="py-2 px-4">
                      {fb.user?.name || "Unknown User"}
                    </td>
                    <td className="py-2 px-4">{capitalizeWords(fb.emoji)}</td>
                    <td className="py-2 px-4">
                      {new Date(fb.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDeleteFeedback(fb._id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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

        {/* Delete All Modal */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete all feedbacks?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 cursor-pointer text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowDeleteAllModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleDeleteAll}
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashLayout>
  );
};

export default Dashboard;



