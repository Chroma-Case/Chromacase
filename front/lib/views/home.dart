import 'dart:html';

import 'package:flutter/material.dart';
import 'package:front/widgets/level_widget.dart';
import 'package:front/widgets/track_button.dart';
import 'package:front/widgets/track_icon.dart';

class HomeView extends StatelessWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(40),
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Bienvenue, John Doe!',
                style: Theme.of(context).textTheme.titleLarge
              ),
              LevelWidget(
                level: 23,
                goodNotesCount: 23000,
                progressWidth: MediaQuery.of(context).size.width * 0.2,
              )
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              for (var i = 1; i <= 5; i++)
              const TrackButton()   
            ],
          )
        ],
      ),
    );
  }
}