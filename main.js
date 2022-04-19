const fs = require('fs');
const carbone = require('carbone');


// Data to inject
var data = {   
    stories: [
        {
            number: "1.1",
            name: 'faire un tour',
            actor: 'Louis Auzuret',
            need: 'dégourdir les jambes',
            description: 'Il faut faire un tour dans la maison de Louis Auzuret pour se dégourdir les jambes.',
            dod: 'Il faut au moins faire 3km',
            charge: '30 minutes ouvrées',
        },
        {
            number: "3.19",
            name: 'Non pertinent',
            actor: 'Zoe Roux',
            need: 'Je veux avoir un répertoire avec plusieurs branches de développement et de l\'intégration continue',
            description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
            dod: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
            charge: '2J/H personne en charge: (Arthur Jamet)',
        },
    ],
    progressReport: {
        summary: 'Ce mois-ci, nous avons fait un total de 3.19 km',
        blockingPoints: 'Il y a des points qui nous empêchent de faire nos devoirs',
        conclusion: 'Nous allons y arriver avec brio !!!!',
        members: [
            {
                name: 'Arthur Jamet',
                tasks: [
                    {name: 'Plazza'},
                    {name: 'Dégourdir les jambes'},
                ],
            },
            {
                name: 'Louis Auzuret',
                tasks: [
                    {name: 'Être meilleur ADC'},
                ],
            },
            {
                name: 'Zoe Roux',
                tasks: [
                    {name: 'Désinstaller VIM'},
                    {name: 'Cuisiner'},
                ],
            },
        ],
    },
    doc: {
        title: 'PLD - Sprint Test & Learn',
        object: 'PLD du sprint Test & Learn',
        author: 'Clément LE BIHAN',
        manager: 'Zoe Roux',
        email: 'zoe.roux@epitech.eu',
        keywords: 'User stories, fonctionnalités, tâches, sprint, DoD',
        promo: '2024',
        ver: [
            {
                date: '12-04-2022',
                num: '0.6.4',
                author: 'Arthur JAMET',
                section: 'Toutes',
                comment: 'Création du modèle'
            },
            {
                date: '15-04-2022',
                num: '1.0.0',
                author: 'Clément LE BIHAN',
                section: 'Toutes',
                comment: 'Première version'
            }
        ]
    }
};

// Generate a report using the sample template provided by carbone module
// This LibreOffice template contains "Hello {d.firstname} {d.lastname} !"
// Of course, you can create your own templates!
carbone.render('./pld.odt', data, function(err, result){
if (err) {
    return console.error(err);
}
    // write the result
    fs.writeFileSync('result.odt', result);
});
