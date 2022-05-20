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
          ResponsiveGridRow(
            rowSegments: 3,
            children: [
              ResponsiveGridCol(
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
              ResponsiveGridCol(
                xs: 2,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(
                    5, (index) => const TrackButton()
                  ).toList(),
                ),
              ),
              ResponsiveGridCol(
                xs: 1,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ColoredButton(
                      label: "Search",
                      color: Theme.of(context).colorScheme.secondary,
                      onTap: () {},
                    ),
                  ],
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
              ),
            ], 
          )
          /*,*/
          /*Wrap(
            runAlignment: WrapAlignment.spaceBetween,
            children: [
              TrackGrid(
                horizontalCount: 4,
                trackButtons: List.generate(6, (index) => const TrackButton())
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  
                ],
              )
            ],
          )*/
          /*StaggeredGrid.count(
            crossAxisCount: 6,
            mainAxisSpacing: 40,
            crossAxisSpacing: 40,
            children: [
              StaggeredGridTile.fit(
                crossAxisCellCount: 4,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    for (var i = 1; i <= 5; i++)
                    const TrackButton()
                  ],
                ),
              ),
              StaggeredGridTile.fit(
                crossAxisCellCount: 4,
                child: Row(
                  children: const [
                    ProgressTable(),
                    // TrackGrid(
                    //   horizontalCount: 2,
                    //   trackButtons: [
                    //     for (int i = 0; i < 6; i++)
                    //     const TrackButton()
                    //   ]
                    // )
                  ],
                )
              ),
              StaggeredGridTile.count(
                crossAxisCellCount: 2,
                mainAxisCellCount: 3,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    ColoredButton(
                      label: "Search",
                      color: Theme.of(context).colorScheme.secondary,
                      onTap: () {},
                    ),
                    TrackGrid(
                      horizontalCount: 2,
                      trackButtons: List.generate(6, (index) => const TrackButton())
                    )
                  ],
                )
              ),
            ],
          ),*/
        ],
      ),
    );
  }
}