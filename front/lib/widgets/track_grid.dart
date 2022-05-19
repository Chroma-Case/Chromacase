import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

class TrackGrid extends StatelessWidget {
  final int horizontalCount;
  final List<Widget> trackButtons;

  const TrackGrid({Key? key, required this.horizontalCount, required this.trackButtons}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Wrap(
        children: trackButtons.map(
          (button) => Padding(
            padding: const EdgeInsets.all(10),
            child: button,
          )
        ).toList(),
      ),
    );
    /*return GridView(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisSpacing: 20,
        mainAxisSpacing: 20,
        childAspectRatio: 100 / 150,
        crossAxisCount: horizontalCount
      ),
      children: trackButtons
    );*/
    /*return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (int i = 0; i < trackButtons.length / horizontalCount; i++)
        Padding(
          padding: const EdgeInsets.only(bottom: 20),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: trackButtons
              .sublist(i, i + horizontalCount)
              .map((button) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: button,
              ))
              .toList(),
          ),
        ),
      ],
    );*/
  }
  
}