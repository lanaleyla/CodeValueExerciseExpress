import  {app}  from './app';

app.set('port', process.env.PORT || 3001);

//set up server and listen
const server = app.listen(app.get('port'), () => {
  console.log(
    ' App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log(' Press CTRL-C to stop\n');
});
