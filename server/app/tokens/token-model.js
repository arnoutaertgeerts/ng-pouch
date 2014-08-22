var mongoose =  require('mongoose'),
    uuid =      require('node-uuid'),
    Schema =    mongoose.Schema,
    ObjectId =  mongoose.types.ObjectId;

// Verification token model
var verificationTokenSchema = new Schema({
    _userId: {type: ObjectId, required: true, ref: 'User'},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
});


/**
 * Instance methods for a document of a Model
 */
verificationTokenSchema.methods = {
    createVerificationToken: function (done) {
        var verificationToken = this;
        var token = uuid.v4();
        verificationToken.set('token', token);
        verificationToken.save( function (err) {
            if (err) return done(err);
            return done(null, token);
        });
    }
 };

var verificationTokenModel = mongoose.model('VerificationToken', verificationTokenSchema);
exports.verificationTokenModel = verificationTokenModel;