import 'package:flutter/material.dart';

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
            ElevatedButton(
              onPressed: () => Navigator.of(context).pushNamed('/login'),
              child: const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text('Login'),
              ),
              style: ElevatedButton.styleFrom(
                primary: Theme.of(context).primaryColor,
                shape: const StadiumBorder(),
              ),
            )
          ],
        ),
      )
    );
  }
}