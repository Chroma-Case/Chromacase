import 'package:flutter/material.dart';

class TrackIcon extends StatelessWidget {
  const TrackIcon({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Image.asset(
          'assets/images/template_art.png',
          width: 100,
        ),
        const Padding(
          padding: EdgeInsets.only(
            top: 2,
            bottom: 12
          ),
          child: Text("Title track"),
        ),
        Text(
          "Artist #1",
          style: Theme.of(context).textTheme.titleSmall
        )
      ],
    );
  }

}