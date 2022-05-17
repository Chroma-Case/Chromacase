import 'package:flutter/material.dart';
import 'package:front/router.dart' as router;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ChromaCase',
      theme: ThemeData(
        colorScheme: const ColorScheme(
          primary: Colors.green,
          onPrimary: Colors.white,
          surface: Colors.white,
          onSurface: Colors.black,
          brightness: Brightness.light,
          background: Colors.white,
          onBackground: Colors.black,
          onSecondary: Colors.white,
          secondary: Colors.cyan, 
          error: Colors.red,
          onError: Colors.white,
        ),
        dividerColor: Colors.grey,
        textTheme: const TextTheme(
          titleLarge: TextStyle(
            fontWeight: FontWeight.bold,
          ),
          titleSmall: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 12
          ),
        )
      ),
      initialRoute: '/welcome',
      routes: router.Router.routes,
    );
  }
}
