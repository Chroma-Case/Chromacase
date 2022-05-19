import 'package:flutter/material.dart';
import 'package:front/widgets/track_icon.dart';
import 'package:front/widgets/utils/rounded_borders.dart';

class TrackButton extends StatelessWidget {
  const TrackButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 150,
      width: 100,
      child: Container(
        decoration: roundedBorders(Theme.of(context).dividerColor),
        clipBehavior: Clip.hardEdge,
        child: InkWell(
          onTap: () {},
          child: const Padding(
            padding: EdgeInsets.all(10),
            child: TrackIcon(),
          ),
        )
      ),
    );
  }
}
