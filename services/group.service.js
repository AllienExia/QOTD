var Group = require('../models/group.model');

function getAllGroup() {
    return new Promise(function(resolve, reject) {
      Group.find({}).populate('training').lean()
      .exec(function (err, groups) {
          if (err) reject(err);
          else resolve(groups);
      })
  }) 
}

function addGroup(params) {
    return new Promise(function(resolve, reject) {
        Group.findOne({training: params.training}).sort({number: '-1'})
        .exec(function (err, group) {
            if (err) reject(err);
            else resolve(group);
        })
  })
  .then(group => {
    return new Promise(function(resolve, reject) {
        if(group !== null) {
            params.number = group._doc.number + 1
        } else {
            params.number = 1
        }
        new Group(params)
        .save(function (err, group) {
            if (err) reject(err);
            else resolve(group);
        })
    })
  })
}

function updateGroup(params) {
    return new Promise(function(resolve, reject) {
        Group.find({number: {$gte: params.number}, training: params.training})
        .exec(function (err, groups) {
            if (err) reject(err);
            else {
                groups.forEach(element => {
                    element._doc.number = element._doc.number + 1
                    Group.where({ _id: element._doc._id }).update({ $set: { number: element._doc.number }})
                    .exec(function (err, group) {
                        if (err) reject(err);
                        else resolve(group);
                    })
                });
                resolve(groups)
            }
        })
    })
  .then(group => {
    return new Promise(function(resolve, reject) {
        Group.where({ _id: params._id }).update({ $set: { number: params.number, title: params.title, answer1: params.answer1, answer2: params.answer2, answer3: params.answer3, answer4: params.answer4, comment: params.comment, right: params.right, training: params.training, chapter: params.chapter }})
        .exec(function (err, group) {
            if (err) reject(err);
            else resolve(group);
        })
    })
  })
}

function deleteGroup(params) {
    return new Promise(function(resolve, reject) {
      Group.deleteMany({ _id: params.toDelete })
      .exec(function (err, group) {
          if (err) reject(err);
          else resolve(group);
      })
  }) 
}

function getAllChapterForTraining(params) {
    return new Promise(function(resolve, reject) {
        Group.find({training: params._id}).distinct('chapter')
        .exec(function (err, chapters) {
            if (err) reject(err);
            else resolve(chapters);
        })
  }) 
}

////////////////////////////////////////////

var self = {
    getAllGroup: getAllGroup,
    addGroup: addGroup,
    updateGroup: updateGroup,
    deleteGroup: deleteGroup,
    getAllChapterForTraining: getAllChapterForTraining
};

module.exports = self;