import React from "react";
import { View } from "react-native";

const ProgressBar = (
  props: { 
    progress: number; 
    maxValue: number; 
    barWidth: number;
    title?: string;
  }) =>
{
    const { progress, maxValue, barWidth, title } = props;

    const containerStyles = {
        height: 20,
        width: `${barWidth}%`,
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        margin: 20
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

    if (title != null) {
      // put the title in the middle TODO
      return (
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>
              {`${computePercent(progress, maxValue)}%`}
            </span>
          </div>
        </div>
    );
    }
    return (
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>
              {`${computePercent(progress, maxValue)}%`}
            </span>
          </div>
        </div>
    );
}

export default ProgressBar;