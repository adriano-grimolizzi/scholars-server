const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const subscriptionList = [{
    id: 1,
    name: 'Adriano',
    song: 'Black',
    artist: 'Pearl Jam'
}, {
    id: 2,
    name: 'Valerio',
    song: 'Mr. Brightside',
    artist: 'Killers'
}];

io.on('connection', socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    }

    socket.on('addSubscription', subscription => {

        if (subscriptionList.length !== 0) {
            subscription.id = Math.max.apply(Math, subscriptionList.map(elem => elem.id)) + 1;
        } else {
            subscription.id = 0;
        }
        subscriptionList.push(subscription);
        safeJoin(subscription.id);
        io.emit('subscriptionList', subscriptionList);
    });

    io.emit('subscriptionList', subscriptionList);

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
