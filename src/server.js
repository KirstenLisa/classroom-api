const { PORT } = require('./config')
const app = require('./app')

//app.get('/api/*', (req, res) => {
//  res.json({'lala': true});
//});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

