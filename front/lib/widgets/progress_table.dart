import 'package:flutter/material.dart';
import 'package:front/widgets/utils/rounded_borders.dart';

class ProgressTable extends StatelessWidget {
  const ProgressTable({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: roundedBorders(Theme.of(context).dividerColor),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            for (int i = 0; i < 6; i++)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text("Ability $i"),
                SizedBox(
                  width: 200,
                  child: LinearProgressIndicator(
                    value: 3 / 4,
                    minHeight: 10,
                    semanticsLabel: '"Ability $i"',
                    color: Theme.of(context).colorScheme.primary,
                    backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
  
}