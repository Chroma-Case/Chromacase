import 'package:flutter/material.dart';
import 'package:front/widgets/colored_button.dart';

class WelcomeView extends StatelessWidget {
  const WelcomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Image.asset(
              'assets/images/title.png',
              width: MediaQuery.of(context).size.width * 0.8,
            ),
            ColoredButton(
              label: "Login",
              onTap: () => Navigator.of(context).pushNamed('/login')
            ),
          ],
        ),
      )
    );
  }
}