import React from 'react'
import { Line } from 'react-chartjs-2'

function timeStempToDate(timestamp){
  const date = new Date()
  date.setTime(timestamp *1000)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds
}

function PoolChart(props){
  console.log("props.data", props.data)
  const timeLabels = props.data.roi.map(item => timeStempToDate(item.timestamp))
  const chartData = props.data.roi.map(item => item[props.property])
  const label = props.label

  const chartsData = {
      labels:timeLabels,
      datasets: [
        {
          label,
          backgroundColor: 'mediumslateblue',
          fill: false,
          lineTension: 0.1,
          borderColor: 'mediumslateblue',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'mediumslateblue',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'mediumslateblue',
          pointHoverBorderColor: 'mediumslateblue',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: chartData,
        }
      ]
  }

  return(
    <div style={{ width: 320, height: 290 }}>
    <Line data={chartsData} />
    </div>

  )
}

export default PoolChart
