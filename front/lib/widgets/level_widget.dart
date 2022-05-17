import 'package:flutter/material.dart';

class LevelWidget extends StatelessWidget {
  const LevelWidget({Key? key, required this.level, required this.goodNotesCount, required this.progressWidth}) : super(key: key);

  final int level;
  final int goodNotesCount;
  final double progressWidth;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: progressWidth,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Niveau $level',
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: LinearProgressIndicator(
              value: 3 / 4,
              semanticsLabel: 'Linear progress indicator',
              color: Theme.of(context).colorScheme.primary,
              backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
            ),
          ),
          Text(
            '$goodNotesCount bonnes notes',
          ),
        ],
      ),
    );
  }
}
