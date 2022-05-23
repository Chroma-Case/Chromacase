import 'dart:async';

import 'package:flutter/material.dart';
import 'package:front/widgets/colored_button.dart';
import 'package:front/widgets/track_button.dart';
import 'package:responsive_grid/responsive_grid.dart';

class SearchView extends StatefulWidget {
  const SearchView({Key? key}) : super(key: key);

  @override
  State<SearchView> createState() => _SearchViewState();
}

class _SearchViewState extends State<SearchView> {
  final _formKey = GlobalKey<FormState>();
  Timer? _searchTimer;
  List<String> _searchResults = const [];

  @override
  void dispose() {
    super.dispose();
    _searchTimer?.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Form(
            key: _formKey,
            child: TextFormField(
              decoration: const InputDecoration(
                hintText: "Search for a track or tips"
              ),
            )
          ),
          ColoredButton(
            label: 'Search',
            onTap: () {
              _formKey.currentState!.save();
              if (_formKey.currentState!.validate()) {
                _searchTimer?.cancel();
                _searchTimer = Timer(
                  const Duration(seconds: 1),
                  () => setState(() {
                    _searchResults = List.generate(10, (index) => index.toString());
                  })
                );
              }
            },
          ),
          ResponsiveGridList(
            scroll: false,
            minSpacing: 30,
            desiredItemWidth: 100,
            rowMainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              for(final result in _searchResults)
              TrackButton(
                trackName: "Track A$result",
                trackArtist: "Artist A$result",
              )
            ]
          )
        ],
      ),
    );
  }
}
