import 'package:flutter/material.dart';
import 'package:front/widgets/colored_button.dart';
import 'package:front/widgets/level_widget.dart';
import 'package:front/widgets/progress_table.dart';
import 'package:front/widgets/track_button.dart';
import 'package:front/widgets/track_grid.dart';

class HomeView extends StatelessWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(40),
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Row(
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
          ),
          Wrap(
            alignment: WrapAlignment.center,
            children: [
              Column(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  TrackGrid(
                    horizontalCount: 5,
                    trackButtons: List.generate(5, (index) => TrackButton(
                      trackName: "Track A$index",
                      trackArtist: "Artist A$index",
                    ))
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      const ProgressTable(),
                      TrackGrid(
                        horizontalCount: 3,
                        trackButtons: List.generate(10, (index) => TrackButton(
                          trackName: "Track B$index",
                          trackArtist: "Artist B$index",
                        ))
                      ),
                    ],
                  )
                ],
              ),
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 100),
                    child: ColoredButton(
                      label: "Search",
                      color: Theme.of(context).colorScheme.secondary,
                      onTap: () => Navigator.of(context).pushNamed('/search'),
                    ),
                  ),
                  TrackGrid(
                    horizontalCount: 3,
                    trackButtons: List.generate(12, (index) => TrackButton(
                      trackName: "Track C$index",
                      trackArtist: "Artist C$index",
                    ))
                  )
                ],
              )
            ], 
          )
        ],
      ),
    );
  }
}