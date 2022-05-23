import 'dart:async';

import 'package:flutter/material.dart';
import 'package:front/widgets/colored_button.dart';
import 'package:front/widgets/track_button.dart';
import 'package:front/widgets/utils/rounded_borders.dart';
import 'package:responsive_grid/responsive_grid.dart';

class SearchView extends StatefulWidget {
  const SearchView({Key? key}) : super(key: key);

  @override
  State<SearchView> createState() => _SearchViewState();
}

class _SearchViewState extends State<SearchView> {
  final _formKey = GlobalKey<FormState>();
  Timer? _searchTimer;
  bool _isLoading = false;
  List<String> _searchResults = const [];

  @override
  void dispose() {
    super.dispose();
    _searchTimer?.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(top: 30),
        child: Column(
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width * 2 / 3,
              child: Form(
                key: _formKey,
                child: Container(
                  decoration: roundedBorders(
                    Theme.of(context).dividerColor
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: TextFormField(
                      cursorColor: Theme.of(context).colorScheme.secondary,
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: "Search for a track or tips",
                      ),
                    ),
                  ),
                )
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 30),
              child: ColoredButton(
                label: 'Search',
                color: Theme.of(context).colorScheme.secondary,
                onTap: () {
                  _formKey.currentState!.save();
                  if (_formKey.currentState!.validate()) {
                    _searchTimer?.cancel();
                    setState(() => _isLoading = true);
                    _searchTimer = Timer(
                      const Duration(seconds: 1),
                      () => setState(() {
                        _searchResults = List.generate(100, (index) => index.toString());
                        _isLoading = false;
                      })
                    );
                  }
                },
              ),
            ),
            if (_isLoading)
            Center(
              child: CircularProgressIndicator(
                color: Theme.of(context).colorScheme.secondary,
              ),
            )
            else
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
      ),
    );
  }
}
