import 'package:flutter/material.dart';
import 'package:front/router.dart' as router;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primaryColor: Colors.green,
        dividerColor: Colors.grey,
        backgroundColor: Colors.white,
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
