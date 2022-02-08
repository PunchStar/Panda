exports.login = async (req, res) =>  {
    console.log('login');
    console.log('req', req.body);
    if(req.body.userName == 'admin' && req.body.password == '99ppPass') {
        res.json({success:true, token:'true'})
    }
    else
        return res.json({success:false})
};