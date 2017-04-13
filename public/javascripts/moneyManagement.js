


let myStocks = [];
let moneyRemaining = 100;
let myHighchart;

//get users stocks
$.get('./userstocks', (data) =>{
    var myElem = document.querySelector('#stocks');
    var myElemTotal = document.querySelector('#defaultMoney');
    for(var i = 0; i < data.stocks.length;i++)
    {   //container for item
        var div = document.createElement("div");
        div.className = "stockItem";
            //title
            var stockTitle = document.createElement('div');
            stockTitle.className= "stockTitle";
            stockTitle.innerText = data.stocks[i].fullname;
            div.appendChild(stockTitle);
            //range
            var range = document.createElement("input");
            range.type = "range";
            range.className = "moneySliders";
            range.min = "0";
            range.max = "100";
            range.value = data.stocks[i].percent;
            range.id = data.stocks[i].stock;
            range.data = data.stocks[i].fullname;
            range.oninput = changedpercent;
            range.onfocus = sliderfocus;
            div.appendChild(range);
            //textfield
            var rangeText = document.createElement('input');
            rangeText.id = "rangeText" +data.stocks[i].stock;
            rangeText.type = "text";
            rangeText.className = "rangeText";
            rangeText.value = data.stocks[i].percent;
            rangeText.readOnly = true;
            div.appendChild(rangeText);
        myElem.appendChild(div); 
        //myElem.appendChild(range);       
        //set range element and remove from total money
        moneyRemaining = moneyRemaining - data.stocks[i].percent;
        myElemTotal.value = moneyRemaining;
        document.querySelector('#totalText').value = moneyRemaining;
        //create range input for stock
        console.log(range.data);
    }
    rebuildMyStocks();

}).fail(() => {
    console.log("error in retreiving stocks");
});

function changedpercent(src){

    var t = Number(document.querySelector('#defaultMoney').value);
    var n = Number(src.srcElement.value);
    var o = Number(document.querySelector('#rangeText'+src.srcElement.id).value);
    //firing whiles to fix fringe browser specific errors 
    while(t == NaN)
        t = Number(document.querySelector('#defaultMoney').value);
    while(n == NaN)
        n = Number(src.srcElement.value);
    while(o == NaN)
        o = Number(src.srcElement.oldValue);
    //console.log("Attempted: "+t + " " + n + " " + o)
    if(n > o)
    {
        if(t != 0)
        {
            if((t-(n-o))<= 0)
            {   
                //console.log("1. Total = " + t + " oldSlider = "+ o + " newslider= " + (t+o) + " new Total = " + 0)
                src.srcElement.value=t+o
                document.querySelector('#defaultMoney').value=0;
                document.querySelector('#totalText').value = document.querySelector('#defaultMoney').value;
                document.querySelector('#rangeText'+src.srcElement.id).value = src.srcElement.value


            } else {
                //console.log("2. Total = " + t + " oldSlider = "+ o + " newslider= " + n + " new Total = " + (n-o))
                document.querySelector('#defaultMoney').value=t-(n-o)
                document.querySelector('#totalText').value = document.querySelector('#defaultMoney').value;
                document.querySelector('#rangeText'+src.srcElement.id).value = src.srcElement.value
  
            }
        } else
        {
            //console.log("3. Total = " + t + " oldSlider = "+ o + " newslider= " + n + " new Total = " + t)
            src.srcElement.value = o;
            document.querySelector('#rangeText'+src.srcElement.id).value = src.srcElement.value

        }
    } else {
            //console.log("4. Total = " + t + " oldSlider = "+ o + " newslider= " + n + " new Total = " + t)
            document.querySelector('#defaultMoney').value=t+(o-n)
            document.querySelector('#totalText').value = document.querySelector('#defaultMoney').value;
            document.querySelector('#rangeText'+src.srcElement.id).value = src.srcElement.value

        
    }
    //console.log("End Values: " +document.querySelector('#defaultMoney').value +" "+src.srcElement.value + " " +src.srcElement.oldValue)
    

    rebuildMyStocks()
}


function rebuildMyStocks()
{
    myStocks = [];
    var myElems = document.querySelectorAll('.moneySliders');
    for(var i = 0; i<myElems.length; i++)
    {
        myStocks.push({
            fullname: myElems[i].data,
            name: myElems[i].id,
            y:Number(myElems[i].value)
        });
    }
    myStocks.push({
        fullname: "Unassigned",
        name:"Unassigned",
        y:Number(document.querySelector('#totalText').value),
        color:"black"
    });
    reloadChart();
}

function sliderfocus(sender){
    sender.srcElement.oldValue = sender.srcElement.value;
}

function reloadChart(){
    var myHighchart = Highcharts.chart('chart', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Total Capital Distribution'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                formatter: function() {
                    if (this.y != 0) {
                        return this.key;
                    } else {
                        return null;
                    }
                }
            }
        }
    },
    series: [{
        type: 
            'pie',
        name: 
            'Percent share',
        data: 
            myStocks
            
    }]
});
}

