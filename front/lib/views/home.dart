import 'dart:html';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:front/widgets/colored_button.dart';
import 'package:front/widgets/level_widget.dart';
import 'package:front/widgets/progress_table.dart';
import 'package:front/widgets/track_button.dart';
import 'package:front/widgets/track_grid.dart';
import 'package:front/widgets/track_icon.dart';
import 'package:responsive_grid/responsive_grid.dart';

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
                    trackButtons: List.generate(5, (index) => const TrackButton())
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      const ProgressTable(),
                      TrackGrid(
                        horizontalCount: 3,
                        trackButtons: List.generate(10, (index) => const TrackButton())
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
                      onTap: () {},
                    ),
                  ),
                  TrackGrid(
                    horizontalCount: 3,
                    trackButtons: List.generate(12, (index) => const TrackButton())
                  )
                ],
              )
              /*ResponsiveGridCol(
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
              ),*/
              /*ResponsiveGridCol(
                xs: 2,
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(
                        5, (index) => const TrackButton()
                      ).toList(),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        const ProgressTable(),
                        TrackGrid(
                          horizontalCount: 2,
                          trackButtons: List.generate(
                            4, (index) => const TrackButton()
                          )
                        )
                      ]
                    ),
                  ],
                ),
              ),*/
              /*ResponsiveGridCol(
                xs: 1,
                child: Container(
                  color: Colors.black,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ColoredButton(
                        label: "Search",
                        color: Theme.of(context).colorScheme.secondary,
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
              ),
              ResponsiveGridCol(
                xs: 2,
                child: Row(
                  children: [
                    Expanded(
                      child: const ProgressTable()
                    ),
                    Expanded(
                      child: TrackGrid(
                        horizontalCount: 3,
                        trackButtons: List.generate(
                          5, (index) => const TrackButton()
                        ).toList()
                      ),
                    )
                  ],
                ),
              ),
              ResponsiveGridCol(
                xs: 1,
                child: Center(
                  child: TrackGrid(
                    horizontalCount: 2,
                    trackButtons: List.generate(6, (index) => const TrackButton())
                  ),
                ),
              ),*/
            ], 
          )
        ],
      ),
    );
  }
}