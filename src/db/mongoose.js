const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://sweyogeshkumar:Aws@4321@cluster0.o8t1yei.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})