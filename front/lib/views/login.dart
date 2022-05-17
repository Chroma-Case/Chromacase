import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';

class LoginView extends StatelessWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FlutterLogin(
        logo: const AssetImage('assets/images/title.png'),
        theme: LoginTheme(
          pageColorLight: Theme.of(context).colorScheme.background,
          pageColorDark: Theme.of(context).colorScheme.background,
          accentColor: Theme.of(context).colorScheme.primary,
          primaryColor: Theme.of(context).colorScheme.primary,
          inputTheme: InputDecorationTheme(
            filled: true,
            fillColor: Theme.of(context).colorScheme.primary.withAlpha(25),
            iconColor:  Theme.of(context).colorScheme.onPrimary
          )
        ),
        onLogin: (LoginData input) => null,
        onRecoverPassword: (String input) => null,
        onSubmitAnimationCompleted: () =>
          Navigator.of(context).pushNamed('/home')
      ),
    );
  }
}
