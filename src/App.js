import React, { useEffect, useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz928iH-alt6Y61XJHclxjg3jJBeqAMPY7kc-mmbNW9IcX1iBXNXlU_fb-hVI3rTGCD/exec";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function ZenMoney() {
  const [investments, setInvestments] = useState([]);
  const [formData, setFormData] = useState({
    Date: "",
    Type: "",
    Price: "",
    "Total Invested": "",
    "Duration / Terms": ""
  });

  const fetchData = async () => {
    const res = await fetch(WEB_APP_URL);
    const data = await res.json();
    setInvestments(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setFormData({ Date: "", Type: "", Price: "", "Total Invested": "", "Duration / Terms": "" });
    fetchData();
  };

  const pieData = Object.values(investments.reduce((acc, curr) => {
    const type = curr.Type;
    const amount = parseFloat(curr["Total Invested"] || 0);
    acc[type] = acc[type] || { name: type, value: 0 };
    acc[type].value += amount;
    return acc;
  }, {}));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">ZenMoney 💸</h1>

      <div className="bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Add Investment</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              placeholder={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="bg-gray-700 border border-gray-600 text-white p-2 rounded"
            />
          ))}
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 col-span-1 md:col-span-5 p-2 rounded text-white">
            Submit
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pie Chart: Total Invested by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Line Chart: Investment Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={investments}>
            <XAxis dataKey="Date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="Total Invested" stroke="#00c49f" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
