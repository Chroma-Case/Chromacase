import 'package:flutter/material.dart';

ShapeDecoration roundedBorders(Color borderColor) {
  return ShapeDecoration(
    shape: RoundedRectangleBorder(
      borderRadius: const BorderRadius.all(Radius.circular(10.0)),
      side: BorderSide(
        width: 0.5,
        color: borderColor
      )
    ),
  );
}