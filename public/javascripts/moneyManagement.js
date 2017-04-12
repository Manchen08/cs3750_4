


let myStocks = [];
let moneyRemaining = 100;

//get users stocks
$.get('./userstocks', (data) =>{
    console.log(data);
    var myElem = document.querySelector('#stocks');
    var myElemTotal = document.querySelector('#defaultMoney');
    for(var i = 0; i < data.stocks.length;i++)
    {
        var range = document.createElement("input");
        range.type = "range";
        range.className = "sliders";
        range.min = "0";
        range.max = "100";
        range.value = data.stocks[i].percent;
        range.id = data.stocks[i].stock;
        range.onchange = changedpercent;
        range.onfocus = sliderfocus;
        myElem.appendChild(range);
        //set range element and remove from total money
        moneyRemaining = moneyRemaining - data.stocks[i].percent;
        myElemTotal.value = moneyRemaining;
        //create range input for stock
    }

}).fail(() => {
    console.log("error in retreiving stocks");
});

function changedpercent(sender){

    var def = document.querySelector('#defaultMoney');
    console.log(sender.srcElement.value + " : " + def.value +" : "+ sender.srcElement.oldValue);
    if(def.value == 0)
    {
        console.log("here");
        //if the value is greater than the old value, reset it to the old value
        if(sender.srcElement.value > sender.srcElement.oldValue){
            sender.srcElement.value = sender.srcElement.oldValue;
        } else {
            //if value is less than the old value, then add it to the money Remaining, and move the slider
            def.value += sender.srcElement.oldValue - sender.srcElement.value;
            moneyRemaining = def.value;
        }
    } else {
        if(sender.srcElement.value - sender.srcElement.oldValue > 0)
        {
            if(def.value - (sender.srcElement.value - sender.srcElement.oldValue) < 0)
            {
                console.log("here1")
                sender.srcElement.value = Number(def.value) + Number(sender.srcElement.oldValue);
                def.value = 0;
                moneyRemaining = 0;
            } else {
                console.log("here2");
                //sender.srcElement.value = sender.srcElement.oldValue;
                def.value -= sender.srcElement.value- sender.srcElement.oldValue;
                moneyRemaining = def.value;
            }
        } else {
            console.log((Number(sender.srcElement.oldValue) - Number(sender.srcElement.value)))
            def.value = Number(def.value) + (Number(sender.srcElement.oldValue) - Number(sender.srcElement.value));
            console.log(def.value);
            moneyRemaining = def.value;
        }
    }
    sender.srcElement.oldValue = sender.srcElement.value;
}

function sliderfocus(sender){
    sender.srcElement.oldValue = sender.srcElement.value;
}

function reloadChart(){
    Highcharts.chart('chart', {
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
        pointFormat: '{series.name}: <b>{point.percentage}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
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

