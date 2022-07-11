import express from "express"


const app = express();


app.get('/test', (req, res) => {
    res.send({
        user:"hochv1",
        password:"testjasd"
    })
});





app.listen(4508, () => {
  console.log('listening on *:4508');
});