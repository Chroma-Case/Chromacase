import 'package:flutter/material.dart';
import 'package:front/views/home.dart';
import 'package:front/views/login.dart';
import 'package:front/views/search.dart';
import 'package:front/views/welcome.dart';

class Router {
  static Map<String, Widget Function(BuildContext)> get routes => {
    '/welcome': (context)  => const WelcomeView(),
    '/login': (context) => const LoginView(),
    '/home': (context)  => const HomeView(),
    '/search': (context)  => const SearchView(),
  };
}
