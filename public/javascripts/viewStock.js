$.get('./userstocks', (data) =>{
    var myStocks = [];
    for(var i = 0; i<data.stocks.length; i++)
    {
        myStocks.push({
            fullname: data.stocks[i].fullname,
            name: data.stocks[i].stock,
            y:Number(data.stocks[i].percent)
        });
    }
    var remains = 100 - myStocks.map((e=> e.y)).reduce(( v1,v2)=>Number(v1)+Number(v2),0);
    console.log(remains);
    myStocks.push({
        fullname: "Reserve",
        name:"Reserve",
        y:Number(remains),
        color:"black"
    });

Highcharts.chart('myChart', {
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
    
}).fail(() => {
    console.log("error in retreiving stocks");
});
