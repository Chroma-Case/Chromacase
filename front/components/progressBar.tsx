import React from "react";

const ProgressBar = (
  props: { 
    progress: number; 
    maxValue: number; 
    barWidth: number;
  }) =>
{
    const { progress, maxValue, barWidth } = props;

    const containerStyles = {
        height: 20,
        width: `${barWidth}%`,
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        margin: 50
      }
    
      function computePercent(progress: number, maxValue: number) 
      {
        return progress * 100 / maxValue;;
      }

      const fillerStyles = {
        height: '100%',
        width: `${computePercent(progress, maxValue)}%`,
        backgroundColor: "#18A558",
        borderRadius: 'inherit',
        textAlign: 'center'
      }
    
      const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
      }

    return (
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>{`${computePercent(progress, maxValue)}%`}</span>
          </div>
        </div>
    );
}

export default ProgressBar;