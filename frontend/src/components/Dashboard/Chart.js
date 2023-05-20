import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const Chart = ({ aspect, title }) => {
  const [data, setdata] = useState([]);
 
  const get = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/count/num`);
      if (result.data) {
        setdata(result.data);
      } else throw Error;
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    get();
  }, []);
 

  

  return (
    <> 
    {data && data.length!==0 ?  
    <div className="chart">
      <div className="c-title">{title}</div>
      <ResponsiveContainer width="90%" aspect={aspect}>
        <AreaChart
          width={500}
          height={250}
          data={data.length > 0 && data.slice && data}
          style={{ padding: "15px" }}
          margin={{ top: 10, right: 10, left: 50, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="24" y2="50">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  : <div className="spinner-grow" role="status">
  <span className="visually-hidden">Loading...</span>
</div>}
  </>
  );
};

export default Chart;
