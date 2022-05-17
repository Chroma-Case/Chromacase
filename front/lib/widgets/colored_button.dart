import 'package:flutter/material.dart';

class ColoredButton extends StatelessWidget {
  final String label;
  final Color? color;
  final Function() onTap;
  const ColoredButton({Key? key, required this.label, this.color, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onTap,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Text(label),
      ),
      style: ElevatedButton.styleFrom(
        primary: color ?? Theme.of(context).colorScheme.primary,
        shape: const StadiumBorder(),
      ),
    );
  }
}
