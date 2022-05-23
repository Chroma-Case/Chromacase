import 'package:flutter/material.dart';

class TrackIcon extends StatelessWidget {
  const TrackIcon({Key? key, required this.trackName, required this.trackArtist}) : super(key: key);
  final String trackName;
  final String trackArtist;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Image.asset(
          'assets/images/template_art.png',
          width: 80,
        ),
        Padding(
          padding: const EdgeInsets.only(top: 2, bottom: 12),
          child: Text(trackName),
        ),
        Text(trackArtist, style: Theme.of(context).textTheme.titleSmall)
      ],
    );
  }
}
