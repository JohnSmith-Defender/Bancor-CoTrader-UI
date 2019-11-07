import React from 'react'
import { Line } from 'react-chartjs-2'

function PoolChart(props){
  console.log("props.data", props.data)
  const timeLabels = props.data.roi.map(item => item.timestamp)
  const chartData = props.data.roi.map(item => item.token_price_in_base_token)
  const label = props.label

  const chartsData = {
      labels:timeLabels,
      datasets: [
        {
          label,
          backgroundColor: 'rgba(138,43,226, 0.4)',
          fill: false,
          lineTension: 0.1,
          borderColor: 'rgba(138,43,226)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(138,43,226)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(138,43,226)',
          pointHoverBorderColor: 'rgba(138,43,226)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: chartData
        }
      ]
  }

  return(
    <div style={{ width: 210, height: 170 }}>
    <Line data={chartsData} />
    </div>

  )
}

export default PoolChart
