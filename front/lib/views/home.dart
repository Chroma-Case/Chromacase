import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:front/widgets/colored_button.dart';
import 'package:front/widgets/level_widget.dart';
import 'package:front/widgets/progress_table.dart';
import 'package:front/widgets/track_button.dart';
import 'package:front/widgets/track_icon.dart';

class HomeView extends StatelessWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(40),
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Hello, John Doe!",
                style: Theme.of(context).textTheme.titleLarge
              ),
              LevelWidget(
                level: 23,
                goodNotesCount: 23000,
                progressWidth: screenWidth * 0.2,
              )
            ],
          ),
          Wrap(
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: List.generate(
                        5,
                        (_) => const Padding(
                          padding: EdgeInsets.all(8.0),
                          child: TrackButton(),
                        )
                      ),
                    ),
                  )
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ColoredButton(
                    label: "Search",
                    onTap: () {}
                  ),
                ],
              )
            ]
          ),
        ]
      )
    );
  }
}