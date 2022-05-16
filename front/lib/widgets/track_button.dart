import 'package:flutter/material.dart';
import 'package:front/widgets/track_icon.dart';

class TrackButton extends StatelessWidget {
  const TrackButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: ShapeDecoration(
        shape: RoundedRectangleBorder(
          borderRadius: const BorderRadius.all(Radius.circular(10.0)),
          side: BorderSide(
            width: 0.5,
            color: Theme.of(context).dividerColor
          )
        ),
      ),
      clipBehavior: Clip.hardEdge,
      child: InkWell(
        onTap: () {},
        child: const Padding(
          padding: EdgeInsets.all(10),
          child: TrackIcon(),
        ),
      )
    );
  }
}
