
/*
 * GET user list
 */

exports.list = function(req, res){
  res.render('layout', {body: 'The user list page!' });
};