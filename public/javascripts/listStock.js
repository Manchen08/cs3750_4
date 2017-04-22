
$(document).ready(() => {

$.ajax({
    url:'/userstocks',
    type: 'GET',
    success: function (res){
            for(var i = 0; i < res.stocks.length;i++){
            var scontain = document.createElement('div');
            scontain.className = "scontain";
            scontain.id = res.stocks[i].stock;
                var sname = document.createElement('div');
                sname.className = "sname";
                sname.innerText = res.stocks[i].fullname; //stockname
                
                var ssymbol = document.createElement('div');
                ssymbol.className = "ssymbol";
                ssymbol.innerText = res.stocks[i].stock;
            
                var sallocated = document.createElement('div');
                sallocated.className = "sallocated";
                sallocated.innerText = res.stocks[i].percent + "%";

                var sprice = document.createElement('div');
                sprice.className = "sprice";
                sprice.id = "sprice"+res.stocks[i].stock;
                sprice.innerText = ""; //add current stock price

                var sud = document.createElement('div');
                sud.className = "sud";
                sud.id = "sud"+res.stocks[i].stock;
                sud.innerText = ""; //add up or down depending on price
                
                var sdelete = document.createElement('div');
                sdelete.className = "sdelete";
                sdelete.innerText = "X";
                sdelete.data = res.stocks[i].stock;
                sdelete.onclick= deleteStock;

            scontain.appendChild(sname);
            scontain.appendChild(ssymbol);
            scontain.appendChild(sallocated);
            scontain.appendChild(sprice);
            scontain.appendChild(sud);
            scontain.appendChild(sdelete);
            document.querySelector('#stocks').appendChild(scontain);

            new Markit.QuoteService(res.stocks[i].stock,function(jsonResult){
                console.log(jsonResult)
                // var mainDiv = document.getElementById('#stocks');
                document.querySelector('#sprice'+jsonResult.Symbol).innerHTML = jsonResult.LastPrice.toString();
                if(jsonResult.Change > 0){
                    document.querySelector('#sud'+jsonResult.Symbol).innerHTML = '&#8679';
                    document.querySelector('#sud'+jsonResult.Symbol).style.color = "green";
                    console.log('Up')
                }else{
                    document.querySelector('#sud'+jsonResult.Symbol).innerHTML = '&#8681';
                    document.querySelector('#sud'+jsonResult.Symbol).style.color = "red";
                    console.log('Down')
                }
            })
        }
    }
})

function deleteStock(e)
{
    
    $.ajax({
            url: '/userstocks',
            type: 'DELETE',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ stock: e.target.data}),
            success: function(res) {
                console.log(res);
                document.querySelector('#'+e.target.data).remove();
            }
        });

}
});









/*
router.post('/deleteStock', function(req, res, next) {
var stock = {
        fullname: req.body.fullname,
        stock: req.body.stock,
        percent: req.body.percent
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('userSchema').find({fullname: stock.fullname, stock: stock.stock, percent: stock.percent}).count(function(error, result) {
            if (result != 0 && error == null) {
                db.collection('userSchema').deleteOne(fullname, stock, percent, function(err, result) {
                    assert.equal(null, err);
                    console.log('Stock Deleted');
                    db.close();
                });
            }
        });
    });
    res.redirect('/listStock');
});
*/

