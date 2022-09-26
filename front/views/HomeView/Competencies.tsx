import React from "react"
import { Card, Text } from "react-native-paper"
import { View } from "react-native"
import ProgressBar from "../../components/progressBar"
import { AvailableLanguages, translate } from "../../i18n/i18n";
import { useSelector } from "react-redux";

const cardFormat = {
    marginLeft: 20,
    width: 700,
    height: 400,
}

const textStyle = {
  fontSize: 20,
  padding: 20,
}

const rowStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between'
}

const Competencies = () => {
  const language: AvailableLanguages = useSelector((state) => state.language.value);

  return (
    <Card style={cardFormat}>
      <Card.Content style={cardFormat}>
        <View style={rowStyle}>
          <Text style={textStyle}> { translate('pedalsCompetency') } </Text>
          <ProgressBar progress={60} maxValue={100} barWidth={70}/>
        </View>
        <View style={rowStyle}>
          <Text style={textStyle}> { translate('rightHandCompetency') } </Text>
          <ProgressBar progress={80} maxValue={100} barWidth={70}/>
        </View>
        <View style={rowStyle}>
          <Text style={textStyle}> { translate('leftHandCompetency') } </Text>
          <ProgressBar progress={30} maxValue={100} barWidth={70}/>
        </View>
        <View style={rowStyle}>
          <Text style={textStyle}> { translate('accuracyCompetency') } </Text>
          <ProgressBar progress={30} maxValue={100} barWidth={70}/>
        </View>
        <View style={rowStyle}>
          <Text style={textStyle}> { translate('arpegeCompetency') } </Text>
          <ProgressBar progress={70} maxValue={100} barWidth={70}/>
        </View>
        <View style={rowStyle}>
          <Text style={textStyle}> { translate('chordsCompetency') } </Text>
          <ProgressBar progress={80} maxValue={100} barWidth={70}/>
        </View>
      </Card.Content>
    </Card>
  );
}

export default Competencies;