var User = require('../models/user.model');
var Group = require('../models/group.model');

function getAllUser() {
    return new Promise(function(resolve, reject) {
      User.find({}).populate('groups.group').populate('groups.training').lean()
      .exec(function (err, users) {
          if (err) reject(err);
          else resolve(users);
      })
  }) 
}

function addUser(params) {
    return new Promise(function(resolve, reject) {
        params.user.groups = [{
            group: params.groupAdd._id,
            training: params.groupAdd.questions[0].training._id,
            chapter: params.chapters,
            stats: {
                numbers: [],
                values: []
            },
            questions: params.groupAdd.questions
        }]
      new User(params.user)
      .save(function (err, user) {
          if (err) reject(err);
          else resolve(user);
      })
  })
  .then(user => {
    return new Promise(function(resolve, reject) {
        Group.findOne({_id: params.groupAdd._id})
        .exec(function (err, group) {
            if (err) reject(err);
            else {
                group.users.push(user._id)
                group.save(function (err, group){
                    if (err) reject(err);
                    else resolve(group);
                })
            }
        })
    })
  })
}

function answerQuestion(params) {
    return new Promise(function(resolve, reject) {
      User.findOne({ _id: params.user._id }).populate('groups.group').populate('groups.training')
      .exec(function (err, user) {
          if (err) reject(err);
          else resolve(user);
      })
  })
  .then(user => {
    return new Promise(function(resolve, reject) {
        user.groups.forEach(element => {
            if(element._doc.group._doc.start < Date.now() && element._doc.group._doc.end > Date.now()) {
                element._doc.questions.forEach(question => {
                    if(question.number === params.question.number) {
                        question.answered = true
                        question.answerDate = Date.now()
                        question.answer = params.rep
                        if(question.right === params.rep)
                            question.good = 1
                        else
                            question.good = 0
                    }
                })
                var total = element._doc.questions.reduce((accumulator, currentValue) => {
                    if (currentValue.answered === true) {
                        return accumulator + 1
                    } else {
                        return accumulator
                    }
                }, 0)
                var good = element._doc.questions.reduce((accumulator, currentValue) => {
                    if (currentValue.answered === true && currentValue.good === 1) {
                        return accumulator + 1
                    } else {
                        return accumulator
                    }
                }, 0)
                if (element._doc.stats.numbers.length === 0) {
                    element._doc.stats.numbers.push(0)
                    element._doc.stats.values.push(100)
                } else if(element._doc.stats.numbers.indexOf(0) !== -1){
                    element._doc.stats.numbers.shift()
                    element._doc.stats.values.shift()
                }
                if (element._doc.stats.numbers.indexOf(0) === -1) {
                    element._doc.stats.numbers.push(element._doc.stats.numbers.length+1)
                }else {
                    element._doc.stats.numbers.push(element._doc.stats.numbers.length)
                }
                
                element._doc.stats.values.push(parseInt((good / total * 100).toFixed(2)))
                user._doc.currentGroup = {} 
                user._doc.currentGroup = element._doc
            }
        })
        User.where({ _id: params.user._id }).update({ $set: { groups: user.groups }})
        .exec(function (err, resul) {
            if (err) reject(err);
            else resolve(user);
        })
    })
  })
}

function addGroupToUser(params) {
    return new Promise(function(resolve, reject) {
        params.user.groups.push({
            group: params.groupAdd._id,
            training: params.groupAdd.questions[0].training._id,
            chapter: params.chapters,
            stats: {
                numbers: [],
                values: []
            },
            questions: params.groupAdd.questions
        })
      User.where({ _id: params.user._id }).update({ $set: { groups: params.user.groups }})
      .exec(function (err, user) {
          if (err) reject(err);
          else resolve(user);
      })
  })
  .then(user => {
    return new Promise(function(resolve, reject) {
        Group.findOne({_id: params.groupAdd._id})
        .exec(function (err, group) {
            if (err) reject(err);
            else {
                group.users.push(params.user._id)
                group.save(function (err, group){
                    if (err) reject(err);
                    else resolve(group);
                })
            }
        })
    })
  })
}

function deleteUser(params) {
    return new Promise(function(resolve, reject) {
        User.find({_id: params.toDelete})
        .exec(function (err, users) {
            if (err) reject(err);
            else {
                users.forEach(user => {
                    user._doc.groups.forEach(group => {
                        Group.find({_id: group._doc.group})
                        .exec(function (err, group2) {
                            if (err) reject(err);
                            else {
                                group2.forEach(gr => {
                                    for(var i = 0 ; i < gr._doc.users.length; i++) {
                                        if (gr._doc.users[i].toString() === user._doc._id.toString()) {
                                            gr._doc.users.splice(i, 1)
                                        }
                                    }
                                    Group.where({ _id: gr._doc._id }).update({ $set: { users: gr._doc.users }})
                                    .exec(function (err, updateGroup) {
                                        if (err) reject(err);
                                    })
                                })
                            }
                        })
                    });
                });
            };
        })
        User.deleteMany({ _id: params.toDelete })
        .exec(function (err, user) {
            if (err) reject(err);
            else resolve(user);
        })
  }) 
}


////////////////////////////////////////////

var self = {
    getAllUser: getAllUser,
    addUser: addUser,
    addGroupToUser: addGroupToUser,
    deleteUser: deleteUser,
    answerQuestion: answerQuestion
};

module.exports = self;