
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Dokter Schema

var DocSchema = new Schema({
    firstName: {type: String, default: 'Gregory'},
    lastName: {type: String, default: 'House'},
    imageURL: {type: String, default: 'http://kwamz.files.wordpress.com/2008/07/hugh-laurie.jpg?w=240&h=300'},
    text: {type: String, default: 'Verander mij aub!'},
    absent: {type: String, default: 'maandag'},
    calendarURL: {type: String, default: "http://agenda.sanmax.be//access_public.php?dcode=SAN11893"},
    showTeam: {type: Boolean, default: true},
    showHome: {type: Boolean, default: true},
    position: {type: Number, default: 1}
});

mongoose.model('Doctor', DocSchema);
