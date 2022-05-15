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
          pageColorLight: Colors.white,
          pageColorDark: Colors.white,
          accentColor: Colors.green,
          primaryColor: Colors.green
        ),
        onLogin: (LoginData input) => null,
        onRecoverPassword: (String input) => null,
        onSubmitAnimationCompleted: () =>
          Navigator.of(context).pushNamed('/home')
      ),
    );
  }
}
