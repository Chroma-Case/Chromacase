import React from "react";

const ProgressBar = (
  props: {
    progress: number;
    maxValue: number;
    barWidth: number;
    title?: string;
  }) =>
{
    const { progress, maxValue, barWidth, title } = props;

    const box = {
      width: `${barWidth}%`,
      height: 20,
      margin: 20,
    }

    const containerStyles = {
      padding: 2,
      backgroundColor: "#e0e0de",
      borderRadius: 50,
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
        textAlign: 'center',
      }

      const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold',
      }

      const titleStyle = {
        padding: 5,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
      }

    if (title != null) {
      return (
        <div style={box}>
          <div style={titleStyle}>
            {title}
          </div>
          <div style={containerStyles}>
            <div style={fillerStyles}>
              <span style={labelStyles}>
                {`${computePercent(progress, maxValue)}%`}
              </span>
            </div>
          </div>
          <div><p>ceci est un sous titre yay</p></div>
        </div>
      );
    }

    return (
      <div style={box}>
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>
              {`${computePercent(progress, maxValue)}%`}
            </span>
          </div>
        </div>
      </div>
    );
}

export default ProgressBar;