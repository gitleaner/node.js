
/*
 * GET home page.
 */

exports.call = function(req, res){
  res.render('call.html');
};

exports.send = function (req,res) {
   res.render('senddata.html');
}