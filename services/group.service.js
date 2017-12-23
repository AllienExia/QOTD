var Group = require('../models/group.model');
var Question = require('../models/question.model');

function getAllGroup() {
    return new Promise(function(resolve, reject) {
      Group.find({}).populate('training').populate('users').lean()
      .exec(function (err, groups) {
          if (err) reject(err);
          else resolve(groups);
      })
  }) 
}


function parseDate(str) {
    var mdy = str.split('-');
    return new Date(mdy[0], mdy[1]-1, mdy[2]);
}

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}
function addDays(startDate,numberOfDays)
{
    var returnDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()+numberOfDays,
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds());
    return returnDate;
}

function addGroup(params) {
    var number = daydiff(parseDate(params.start), parseDate(params.end)) + 1
    return new Promise(function(resolve, reject) {
        Question.find({training: params.training}).sort({number: '1'}).limit(number).populate('training').lean()
        .exec(function (err, questions) {
            if (err) reject(err);
            else resolve(questions);
        })
  })
  .then(questions => {
    var dateStart = parseDate(params.start)
    return new Promise(function(resolve, reject) {
        params.questions = []
        var tempQuestion = questions.slice(0)
        var count = 1
        tempQuestion.forEach(element => {
            params.questions.unshift({
                "training" : element.training,
                "chapter" : element.chapter,
                "number" : count,
                "title" : element.title,
                "comment" : element.comment,
                "answer1" : element.answer1,
                "answer2" : element.answer2,
                "answer3" : element.answer3,
                "answer4" : element.answer4,
                "right" : element.right,
                "date": addDays(dateStart, count-1),
                "answered" : false,
                "good": 0
            })
            count++
        });
        tempQuestion = null
        tempQuestion = questions.slice(0)
        if (params.questions.length < number) {
            shuffle(tempQuestion)  
            tempQuestion.forEach(element => {
                if (params.questions.length < number) {
                    params.questions.unshift({
                        "training" : element.training,
                        "chapter" : element.chapter,
                        "number" : count,
                        "title" : element.title,
                        "comment" : element.comment,
                        "answer1" : element.answer1,
                        "answer2" : element.answer2,
                        "answer3" : element.answer3,
                        "answer4" : element.answer4,
                        "right" : element.right,
                        "date": addDays(dateStart, count),
                        "answered" : false,
                        "good": 0
                    })
                }
                count++
            });
        } 
        tempQuestion = null
        tempQuestion = questions.slice(0)
        if (params.questions.length < number) {
            shuffle(tempQuestion)  
            tempQuestion.forEach(element => {
                if (params.questions.length < number) {
                    params.questions.unshift({
                        "training" : element.training,
                        "chapter" : element.chapter,
                        "number" : count,
                        "title" : element.title,
                        "comment" : element.comment,
                        "answer1" : element.answer1,
                        "answer2" : element.answer2,
                        "answer3" : element.answer3,
                        "answer4" : element.answer4,
                        "right" : element.right,
                        "date": addDays(dateStart, count),
                        "answered" : false,
                        "good": 0
                    })
                }
                count++
            });
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