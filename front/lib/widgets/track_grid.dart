import 'package:flutter/material.dart';

class TrackGrid extends StatelessWidget {
  final int horizontalCount;
  final List<Widget> trackButtons;

  const TrackGrid({Key? key, required this.horizontalCount, required this.trackButtons}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        for (int i = 0; i < trackButtons.length / horizontalCount; i++)
        Padding(
          padding: const EdgeInsets.only(bottom: 20),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: trackButtons
              .sublist(i, i + horizontalCount)
              .map((button) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: button
              ))
              .toList(),
          ),
        ),
      ],
    );
  }
  
}