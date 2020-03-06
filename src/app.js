const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const subscriptionList = [{
    id: 0,
    name: 'Adriano',
    song: 'Black',
    artist: 'Pearl Jam'
}, {
    id: 1,
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

    socket.on('switchPosition', switchPosition => {

    	console.log('Switching Position ' + switchPosition.index1 + " with " + switchPosition.index2);

    	swapArrayElements(subscriptionList, switchPosition.index1, switchPosition.index2);

    	io.emit('subscriptionList', subscriptionList);
    });

    io.emit('subscriptionList', subscriptionList);

    console.log(`Socket ${socket.id} has connected`);
});

var swapArrayElements = function(arr, indexA, indexB) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
